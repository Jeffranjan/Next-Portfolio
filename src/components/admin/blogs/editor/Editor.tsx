'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import { useEffect } from 'react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import { common, createLowlight } from 'lowlight'
import EditorToolbar from './EditorToolbar'
import styles from './editor.module.css'

// Simplify lowlight setup for now
const lowlight = createLowlight(common)

interface EditorProps {
    initialContent?: any
    onChange: (content: any) => void
    editable?: boolean
}

export default function Editor({ initialContent, onChange, editable = true }: EditorProps) {
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                codeBlock: false, // We use the lowlight extension
                // @ts-ignore - Disable link if it exists in this version
                link: false,
            }),
            Image,
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: 'text-primary underline cursor-pointer',
                }
            }),
            CodeBlockLowlight.configure({
                lowlight,
            }),
        ],
        content: (initialContent && Object.keys(initialContent).length > 0) ? initialContent : undefined,
        editable,
        editorProps: {
            attributes: {
                class: 'prose prose-invert max-w-none focus:outline-none min-h-[400px]',
            },
        },
        onUpdate: ({ editor }) => {
            const json = editor.getJSON()
            onChange(json)
        },
        immediatelyRender: false,
    })

    // Attach paste/drop handlers dynamically to access editor instance
    useEffect(() => {
        if (!editor) return

        editor.setOptions({
            editorProps: {
                handlePaste: (view, event) => {
                    if (event.clipboardData && event.clipboardData.files.length > 0) {
                        const file = event.clipboardData.files[0]
                        if (file.type.startsWith('image/')) {
                            event.preventDefault()
                            const formData = new FormData()
                            formData.append('file', file)

                            // Upload via server action
                            import('@/app/admin/upload/actions').then(async ({ uploadImage }) => {
                                const res = await uploadImage(formData)
                                if (res?.success && res.url) {
                                    // Use Tiptap command for safe block insertion
                                    editor.chain().focus().setImage({ src: res.url }).run()
                                } else {
                                    console.error('❌ Upload failed:', res?.error)
                                    alert(res?.error || 'Failed to upload pasted image')
                                }
                            })
                            return true // Handled
                        }
                    }
                    return false
                },
                handleDrop: (view, event) => {
                    if (event.dataTransfer && event.dataTransfer.files.length > 0) {
                        const file = event.dataTransfer.files[0]
                        if (file.type.startsWith('image/')) {
                            event.preventDefault()
                            const formData = new FormData()
                            formData.append('file', file)

                            import('@/app/admin/upload/actions').then(async ({ uploadImage }) => {
                                const res = await uploadImage(formData)
                                if (res?.success && res.url) {
                                    editor.chain().focus().setImage({ src: res.url }).run()
                                } else {
                                    alert(res?.error || 'Failed to upload dropped image')
                                }
                            })
                            return true // Handled
                        }
                    }
                    return false
                }
            }
        })
    }, [editor])

    return (
        <div className="w-full">
            {editor && <EditorToolbar editor={editor} />}
            <div className={`bg-[#111] border border-[#333] rounded-lg p-6 min-h-[500px] ${styles.editorWrapper}`}>
                <EditorContent editor={editor} />
            </div>
        </div>
    )
}
