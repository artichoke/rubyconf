# frozen_string_literal: true

a = []
a[1_000_000_000_000_000] = 'quadrillion'

a.concat((0..1000).to_a)

100.times do |i|
  a.unshift(i)
end

b = a.reverse

b[500_000, 500_000] = [Object.new, /Array/, 100.0]

puts a.length # => 1000000000001102
puts b.length # => 999999999501105
