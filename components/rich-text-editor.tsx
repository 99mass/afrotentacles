"use client"

import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Paragraph from "@tiptap/extension-paragraph"
import Text from "@tiptap/extension-text"
import LinkExtension from "@tiptap/extension-link"
import {
  Bold,
  Italic,
  Strikethrough,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Code,
  Undo,
  Redo,
  Type,
  Link2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import "./rich-text-editor.css"

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export function RichTextEditor({ value, onChange, placeholder = "Rédigez votre texte ici..." }: RichTextEditorProps) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
        paragraph: {
          HTMLAttributes: {
            class: "paragraph",
          },
        },
        bulletList: {
          HTMLAttributes: {
            class: "bullet-list",
          },
        },
        orderedList: {
          HTMLAttributes: {
            class: "ordered-list",
          },
        },
        blockquote: {
          HTMLAttributes: {
            class: "blockquote",
          },
        },
        codeBlock: {
          HTMLAttributes: {
            class: "code-block",
          },
        },
      }),
      LinkExtension.configure({
        openOnClick: false,
        HTMLAttributes: {
          target: '_blank',
          rel: 'noopener noreferrer',
          class: 'text-primary underline hover:opacity-80 transition-opacity',
        },
      }),
    ],
    content: value || "<p></p>",
    onUpdate: ({ editor }) => {
      const html = editor.getHTML()
      onChange(html)
    },
    editorProps: {
      attributes: {
        class: "prose prose-sm max-w-none focus:outline-none min-h-64",
      },
    },
  })

  const setLink = () => {
    if (!editor) return
    const previousUrl = editor.getAttributes('link').href
    const url = window.prompt('Entrez l\'URL du lien :', previousUrl || '')

    // Cancelled
    if (url === null) {
      return
    }

    // Empty
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
      return
    }

    // Ensure URL has protocol if it's external and doesn't start with it
    let formattedUrl = url
    if (!url.startsWith('http://') && !url.startsWith('https://') && !url.startsWith('/') && !url.startsWith('#')) {
      formattedUrl = `https://${url}`
    }

    editor.chain().focus().extendMarkRange('link').setLink({ href: formattedUrl }).run()
  }

  if (!editor) {
    return null
  }

  const buttonClass = "h-9 w-9 p-2 hover:bg-muted"
  const activeButtonClass = "bg-muted text-primary"

  return (
    <div className="border border-input rounded-lg overflow-hidden bg-background">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-1 p-2 border-b border-input bg-muted/30">
        {/* Text Formatting */}
        <div className="flex gap-1 border-r border-input pr-1">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={cn(buttonClass, editor.isActive("bold") && activeButtonClass)}
            title="Gras (Ctrl+B)"
          >
            <Bold className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={cn(buttonClass, editor.isActive("italic") && activeButtonClass)}
            title="Italique (Ctrl+I)"
          >
            <Italic className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleStrike().run()}
            className={cn(buttonClass, editor.isActive("strike") && activeButtonClass)}
            title="Barré"
          >
            <Strikethrough className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleCode().run()}
            className={cn(buttonClass, editor.isActive("code") && activeButtonClass)}
            title="Code inline"
          >
            <Code className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={setLink}
            className={cn(buttonClass, editor.isActive("link") && activeButtonClass)}
            title="Insérer un lien"
          >
            <Link2 className="h-4 w-4" />
          </Button>
        </div>

        {/* Headings */}
        <div className="flex gap-1 border-r border-input pr-1">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            className={cn(buttonClass, editor.isActive("heading", { level: 1 }) && activeButtonClass)}
            title="Titre 1"
          >
            <Heading1 className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={cn(buttonClass, editor.isActive("heading", { level: 2 }) && activeButtonClass)}
            title="Titre 2"
          >
            <Heading2 className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            className={cn(buttonClass, editor.isActive("heading", { level: 3 }) && activeButtonClass)}
            title="Titre 3"
          >
            <Heading3 className="h-4 w-4" />
          </Button>
        </div>

        {/* Lists */}
        <div className="flex gap-1 border-r border-input pr-1">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={cn(buttonClass, editor.isActive("bulletList") && activeButtonClass)}
            title="Liste à puces"
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={cn(buttonClass, editor.isActive("orderedList") && activeButtonClass)}
            title="Liste numérotée"
          >
            <ListOrdered className="h-4 w-4" />
          </Button>
        </div>

        {/* Blockquote & Code Block */}
        <div className="flex gap-1 border-r border-input pr-1">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={cn(buttonClass, editor.isActive("blockquote") && activeButtonClass)}
            title="Citation"
          >
            <Quote className="h-4 w-4" />
          </Button>
        </div>

        {/* Undo/Redo */}
        <div className="flex gap-1">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().undo().run()}
            className={buttonClass}
            title="Annuler"
          >
            <Undo className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().redo().run()}
            className={buttonClass}
            title="Refaire"
          >
            <Redo className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Editor */}
      <div className="p-4 min-h-80 font-serif">
        <EditorContent 
          editor={editor} 
          className="rich-text-content"
        />
      </div>

      {/* Character Count */}
      <div className="px-4 py-2 border-t border-input bg-muted/20 text-xs text-muted-foreground">
        {value.replace(/<[^>]*>/g, '').length} caractères
      </div>
    </div>
  )
}
