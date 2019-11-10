### `String#scan`

`Regexp` pattern over 6.8MB of Unicode text 📚

```ruby
raise unless $fixture.scan(%r{https?://}).length == 3539+1865
raise unless $fixture.scan(/表达式/).length == 120
raise unless $fixture.scan(/\r\n/).empty?
```
