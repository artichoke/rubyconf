# frozen_string_literal: true

# rubocop:disable Style/GlobalVars
if (path = ENV['FIXTURE'])
  $fixture = File.read(path)
end

raise 'mismatch' unless $fixture.scan('http://').length == 3539
raise 'mismatch' unless $fixture.scan('https://').length == 1865
raise 'mismatch' unless $fixture.scan("\r\n").empty?
# rubocop:enable Style/GlobalVars
