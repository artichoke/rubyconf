#### Syntax

```ruby
def dig(idx, *args)
  item = self[idx]
  if args.empty?
    item
  else
    item&.dig(*args)
  end
end
```
