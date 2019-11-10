#!/usr/bin/env bash

# This script will run the benchmarks in the artichoke/rubyconf
# repository. Tested on Ubuntu; may work on Debian.

sudo apt-get update
sudo apt-get install -y git bison clang llvm ruby-build
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
# shellcheck disable=SC1090
source "$HOME/.cargo/env"
mkdir "$HOME/bin"

wget https://raw.githubusercontent.com/rbenv/ruby-build/master/share/ruby-build/2.6.3
ruby-build ./2.6.3 "$HOME/ruby2.6.3"
cp "$HOME/ruby2.6.3/bin/ruby" "$HOME/bin/ruby"

git clone https://github.com/artichoke/artichoke.git
pushd artichoke || exit 1
rustup install "$(cat rust-toolchain)"
cargo build --release
popd || exit 1
cp "$HOME/artichoke/target/release/artichoke" "$HOME/bin"

git clone https://github.com/eregon/precise-time.git
pushd precise-time || exit 1
make
popd || exit 1
cp "$HOME/precise-time/precise-time" "$HOME/bin"

export PATH="$HOME/bin:$PATH"
ruby --version
artichoke --version

wget https://raw.githubusercontent.com/artichoke/artichoke/master/artichoke-frontend/ruby/fixtures/learnxinyminutes.txt
cat <<'EOF' > bench_string_needle.rb
# frozen_string_literal: true

# rubocop:disable Style/GlobalVars
if (path = ENV['FIXTURE'])
  $fixture = File.read(path)
end

raise 'mismatch' unless $fixture.scan('http://').length == 3539
raise 'mismatch' unless $fixture.scan('https://').length == 1865
raise 'mismatch' unless $fixture.scan('表达式').length == 120
raise 'mismatch' unless $fixture.scan("\r\n").empty?
# rubocop:enable Style/GlobalVars
EOF
cat <<'EOF' > bench_string_needle_re.rb
# frozen_string_literal: true

# rubocop:disable Style/GlobalVars
if (path = ENV['FIXTURE'])
  $fixture = File.read(path)
end

raise 'mismatch' unless $fixture.scan(%r{https?://}).length == 3539 + 1865
raise 'mismatch' unless $fixture.scan(/表达式/).length == 120
raise 'mismatch' unless $fixture.scan(/\r\n/).empty?
# rubocop:enable Style/GlobalVars
EOF

cat <<'EOF' > bench_ary_sparse.rb
# frozen_string_literal: true

a = []
a[1_000_000_000_000_000] = 'quadrillion'

a.concat((0..1000).to_a)

100.times do |i|
  a.unshift(i)
end

b = a.reverse

b[123_456_789, 500_000] = [Object.new, /Array/, 100.0]

puts a.length # => 1000000000001102
puts b.length # => 999999999501105
EOF

precise-time 50 "$HOME/bin/artichoke" --with-fixture learnxinyminutes.txt bench_string_needle.rb
env FIXTURE=learnxinyminutes.txt precise-time 50 "$HOME/bin/ruby" bench_string_needle.rb
precise-time 50 "$HOME/bin/artichoke" --with-fixture learnxinyminutes.txt bench_string_needle_re.rb
env FIXTURE=learnxinyminutes.txt precise-time 50 "$HOME/bin/ruby" bench_string_needle_re.rb
