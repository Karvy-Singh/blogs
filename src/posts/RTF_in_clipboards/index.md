# How is Rich Text Format preserved while copy-pasting?

So, if you ever copy some formatted text from a website, say, bold text, and paste it somewhere else, like maybe Google Docs or ChatGPT, you will notice that rich text formatting properties like bold text (or italics, underlining, etc.) are preserved.
I witnessed this, and that ignited a spark of curiosity in me: how does this happen exactly?

My first thoughts were: rich text is just something that we can **see** after HTML is processed and the page is rendered in the browser. So how does the clipboard know something that is *visually* evident to human eyes?
Let's answer that below.

# Clipboard-browser interaction

## It all starts with the DOM

Consider a simple webpage:

```html
<p>
  Hello <strong>World</strong>!
  This is <em>important</em>.
</p>
```

The browser doesn't simply display this HTML as text.

Its HTML parser converts the markup into a tree of objects called the Document Object Model (DOM).

Conceptually, the structure looks like this:

```text
Document
   |
   └── <p>
        |
        ├── Text("Hello ")
        |
        ├── <strong>
        |      └── Text("World")
        |
        ├── Text("! This is ")
        |
        ├── <em>
        |      └── Text("important")
        |
        └── Text(".")
```

Every element and text node exists as an object in the browser's memory.
The browser combines this structure with CSS and layout information to render the page on your screen.

The DOM can also change dynamically through JavaScript. What you see in DevTools is the current DOM, not necessarily the original HTML returned by the server.

This distinction becomes important when we start selecting text.

## What actually happens when you select text?

When you click and drag over text, the browser receives pointer events containing coordinates.

Its rendering engine performs hit testing to determine which rendered object exists at that position. Using text layout information, it maps that position to a location inside a text node.

For example, imagine selecting "World" from:

```html
<p>Hello <strong>World</strong>!</p>
```

Conceptually, the selected range could be represented as:

```text
{
  startContainer: worldTextNode,
  startOffset: 0,

  endContainer: worldTextNode,
  endOffset: 5
}
```

These offsets identify positions within the text node.

## Pressing `Ctrl+C`

> Note: To explain how a browser interacts with the clipboard to preserve RTF during the copying operation, I will use some code snippets from Chromium's source code. The code can differ across browsers, but the functionality remains roughly the same.

Inside Chromium's Blink rendering engine, there's a C++ file called:

[`clipboard_commands.cc`](https://chromium.googlesource.com/chromium/src/+/refs/heads/main/third_party/blink/renderer/core/editing/commands/clipboard_commands.cc)

One of its functions is:

```cpp
ClipboardCommands::WriteSelectionToClipboard(
    LocalFrame& frame)
```

A `LocalFrame` represents a document frame managed by Blink.
The copy operation first obtains the selected content in two different representations: `plain` text and `text/html`. Now, depending upon the clipboard, if it supports rich text, both are saved; if not, only plain text is accepted.

```cpp
const String html =
    frame.Selection().SelectedHtmlForClipboard();

String plain_text =
    frame.SelectedTextForClipboard();
```

> Note: The browser isn't necessarily copying the exact HTML you see in DevTools. It serializes the selected part of the document, which might contain only a portion of an element.

Another important file is:
[`frame_selection.cc`](https://chromium.googlesource.com/chromium/src/+/refs/heads/main/third_party/blink/renderer/core/editing/frame_selection.cc)

It contains something like:

```cpp
CreateMarkup(
    range.StartPosition(),
    range.EndPosition(),
    options
);

```

The snippet above simplifies the options argument.

This is where Chromium takes a selected document range and begins converting it into serialized HTML. The actual HTML serialization machinery is implemented using components such as `StyledMarkupSerializer`.

For the plain-text representation, Chromium follows a different path:

```text
SelectedTextForClipboard()
          |
          v
ExtractSelectedText()
          |
          v
PlainText()
          |
          v
TextIterator

```

The text iterator walks the relevant document content and extracts its textual representation.

## How does the browser communicate with the system clipboard?

This is where another interesting function appears: `frame.GetSystemClipboard()`.
Its implementation lives in Chromium's `local_frame.cc`.

In essence, the function returns a `SystemClipboard` object associated with the frame, creating one if necessary. It's a form of lazy initialization.

The object provides methods such as:

```cpp
clipboard->WriteHTML(...);

clipboard->WritePlainText(...);

clipboard->CommitWrite();

```

> Note: The `SystemClipboard` object doesn't directly manipulate the Windows or macOS clipboard from the rendering engine. Chromium uses Mojo, its inter-process communication (IPC) system, to do the same.

Looking inside Chromium's `system_clipboard.cc`, we find a call like:

```cpp
clipboard_->WriteHtml(
    NonNullString(markup),
    document_url
);
```

Here, `clipboard_` is a Mojo interface.

## How is the rich text pasted into other applications?

Each application contains its own code to parse the input coming from the clipboard and preserve certain qualities. A pseudocode representation of the same, for no specific application, can be written as:

```js
const formats = clipboard.availableFormats();

if (formats.includes("text/html")) {
  const html = clipboard.read("text/html");

  editor.insertRichText(html);
} else {
  const text = clipboard.read("text/plain");

  editor.insertText(text);
}
```

A website may do something like: read clipboard HTML, process it into a `DocumentFragment`, and insert the resulting nodes into the editable document.

## Other data formats of copypasta

Some common examples:

| Clipboard representation | Purpose |
| --- | --- |
| `text/plain` | Unformatted text |
| `text/html` | Richly formatted text |
| `image/png` | Image data |
| `image/svg+xml` | Vector images, where supported |
| `text/uri-list` | URLs |
| RTF | Rich Text Format |
| File references | Copying files between applications |
| Application-specific formats | Structured editor or application data |
