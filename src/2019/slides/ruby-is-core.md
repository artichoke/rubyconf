### Ruby Core

```ruby
ENV['DRY_RUN'] = '0'
ary = Array.new(1024, 'Artichoke Ruby')
fixture = File.read(
  'artichoke-frontend/ruby/fixtures/learnxinyminutes.txt'
)
/function/.match(fixture)
```