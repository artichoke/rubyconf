#### Behavior — ruby/spec

```ruby
describe "Regexp#named_captures" do
  it "returns a Hash" do
    /foo/.named_captures.should be_an_instance_of(Hash)
  end

  it "returns an empty Hash when there are no capture groups" do
    /foo/.named_captures.should == {}
  end

  it "sets the keys of the Hash to the names of the capture groups" do
    rex = /this (?<is>is) [aA] (?<pat>pate?rn)/
    rex.named_captures.keys.should == ['is','pat']
  end
end
```
