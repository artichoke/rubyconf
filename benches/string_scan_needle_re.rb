# frozen_string_literal: true

# rubocop:disable Style/GlobalVars
if (path = ENV.fetch('FIXTURE', nil))
  $fixture = File.read(path)
end

raise 'mismatch' unless $fixture.scan(%r{https?://}).length == 3539 + 1865
raise 'mismatch' unless $fixture.scan(/表达式/).length == 120
raise 'mismatch' unless $fixture.scan(/\r\n/).empty?
# rubocop:enable Style/GlobalVars
