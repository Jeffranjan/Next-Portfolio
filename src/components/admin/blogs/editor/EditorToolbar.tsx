'use client'

import { type Editor } from '@tiptap/react'
import {
    Bold,
    Italic,
    Strikethrough,
    Code,
    List,
    ListOrdered,
    Quote,
    Minus,
    Undo,
    Redo,
    Link as LinkIcon,
    Image as ImageIcon,
    Heading1,
    Heading2,
    Heading3,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface EditorToolbarProps {
    editor: Editor
}

export default function EditorToolbar({ editor }: EditorToolbarProps) {
    if (!editor) {
        return null
    }

    const setLink = () => {
        const previousUrl = editor.getAttributes('link').href
        const url = window.prompt('URL', previousUrl)

        if (url === null) {
            return
        }

        if (url === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run()
            return
        }

        editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
    }

    const addImage = () => {
        const url = window.prompt('Image URL')

        if (url) {
            editor.chain().focus().setImage({ src: url }).run()
        }
    }

    const buttons = [
        {
            icon: Bold,
            title: 'Bold',
            action: () => editor.chain().focus().toggleBold().run(),
            isActive: () => editor.isActive('bold'),
        },
        {
            icon: Italic,
            title: 'Italic',
            action: () => editor.chain().focus().toggleItalic().run(),
            isActive: () => editor.isActive('italic'),
        },
        {
            icon: Strikethrough,
            title: 'Strike',
            action: () => editor.chain().focus().toggleStrike().run(),
            isActive: () => editor.isActive('strike'),
        },
        {
            icon: Code,
            title: 'Code',
            action: () => editor.chain().focus().toggleCode().run(),
            isActive: () => editor.isActive('code'),
        },
        { divider: true },
        {
            icon: Heading1,
            title: 'H1',
            action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
            isActive: () => editor.isActive('heading', { level: 1 }),
        },
        {
            icon: Heading2,
            title: 'H2',
            action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
            isActive: () => editor.isActive('heading', { level: 2 }),
        },
        {
            icon: Heading3,
            title: 'H3',
            action: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
            isActive: () => editor.isActive('heading', { level: 3 }),
        },
        { divider: true },
        {
            icon: List,
            title: 'Bullet List',
            action: () => editor.chain().focus().toggleBulletList().run(),
            isActive: () => editor.isActive('bulletList'),
        },
        {
            icon: ListOrdered,
            title: 'Ordered List',
            action: () => editor.chain().focus().toggleOrderedList().run(),
            isActive: () => editor.isActive('orderedList'),
        },
        {
            icon: Quote,
            title: 'Blockquote',
            action: () => editor.chain().focus().toggleBlockquote().run(),
            isActive: () => editor.isActive('blockquote'),
        },
        { divider: true },
        {
            icon: LinkIcon,
            title: 'Link',
            action: setLink,
            isActive: () => editor.isActive('link'),
        },
        {
            icon: ImageIcon,
            title: 'Image',
            action: () => {
                const input = document.createElement('input')
                input.type = 'file'
                input.accept = 'image/*'
                input.onchange = async () => {
                    if (input.files?.length) {
                        const file = input.files[0]
                        const formData = new FormData()
                        formData.append('file', file)

                        // Show loading state or optimized toast here
                        const { uploadImage } = await import('@/app/admin/upload/actions')
                        const res = await uploadImage(formData)

                        if (res?.success && res.url) {
                            editor.chain().focus().setImage({ src: res.url }).run()
                        } else {
                            alert(res?.error || 'Upload failed')
                        }
                    }
                }
                input.click()
            },
            isActive: () => editor.isActive('image'),
        },
        { divider: true },
        {
            icon: Minus,
            title: 'Horizontal Rule',
            action: () => editor.chain().focus().setHorizontalRule().run(),
        },
        {
            icon: Undo,
            title: 'Undo',
            action: () => editor.chain().focus().undo().run(),
            disabled: () => !editor.can().chain().focus().undo().run(),
        },
        {
            icon: Redo,
            title: 'Redo',
            action: () => editor.chain().focus().redo().run(),
            disabled: () => !editor.can().chain().focus().redo().run(),
        },
    ]

    return (
        <div className="flex flex-wrap items-center gap-1 p-2 mb-4 bg-[#111] border border-[#333] rounded-lg sticky top-6 z-10 backdrop-blur-md bg-opacity-90">
            {buttons.map((btn, index) => {
                if (btn.divider) {
                    return <div key={index} className="w-px h-6 bg-[#333] mx-1" />
                }

                const Icon = btn.icon!
                return (
                    <button
                        key={index}
                        onClick={(e) => {
                            e.preventDefault()
                            btn.action!()
                        }}
                        disabled={btn.disabled?.()}
                        className={cn(
                            "p-2 rounded hover:bg-white/10 text-gray-400 transition-colors",
                            btn.isActive?.() ? "text-primary bg-primary/10" : "hover:text-white",
                            btn.disabled?.() && "opacity-50 cursor-not-allowed hover:bg-transparent hover:text-gray-400"
                        )}
                        title={btn.title}
                    >
                        <Icon className="w-4 h-4" />
                    </button>
                )
            })}
        </div>
    )
}
