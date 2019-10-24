#### MRI C API

```c
mNokogiri         = rb_define_module("Nokogiri");
mNokogiriXml      = rb_define_module_under(mNokogiri, "XML");
mNokogiriHtml     = rb_define_module_under(mNokogiri, "HTML");
mNokogiriXslt     = rb_define_module_under(mNokogiri, "XSLT");
mNokogiriXmlSax   = rb_define_module_under(mNokogiriXml, "SAX");
mNokogiriHtmlSax  = rb_define_module_under(mNokogiriHtml, "SAX");
```
