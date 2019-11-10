### `String#scan`

`String` pattern over 6.8MB of Unicode text 📚

```ruby
raise unless $fixture.scan('http://').length == 3539
raise unless $fixture.scan('https://').length == 1865
raise unless $fixture.scan('表达式').length == 120
raise unless $fixture.scan("\r\n").empty?
```
