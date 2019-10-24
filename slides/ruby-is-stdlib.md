#### Standard Library

```ruby
require 'forwardable'
require 'json'

class Properties
  extend Forwardable
  def_delegators :@properties, :[], :[]=, :to_json
  def initialize
    @properties = {}
  end
end
artichoke = Properties.new
artichoke[:lang] = 'Ruby'
artichoke[:impl] = 'Artichoke'

puts JSON.pretty_generate(artichoke)
```
