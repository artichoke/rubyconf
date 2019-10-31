# frozen_string_literal: true

[10_000, 1_000_000, 100_000_000].each do |n|
  ary = Array.new(n, 0)
  ary.shift

  (0..4).each do |i|
    ary = Array.new(n, 0)
    ary.shift(i)
  end
end
