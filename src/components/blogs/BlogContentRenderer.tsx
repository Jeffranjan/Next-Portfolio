import { cn } from '@/lib/utils'
import { common, createLowlight } from 'lowlight'

// We need to implement a simple JSON renderer for Tiptap
// Since we don't want to use dangerouslySetInnerHTML unless absolutely necessary for trusted admin content,
// we'll map the nodes to React components.

// Create lowlight instance for highlighting (server-side capable basically)
const lowlight = createLowlight(common)

interface RendererProps {
    content: any
}

export default function BlogContentRenderer({ content }: RendererProps) {
    if (!content || !content.content) return null

    return (
        <div className="prose prose-invert prose-p:text-gray-300 prose-headings:font-display prose-headings:font-bold prose-a:text-primary prose-code:text-primary prose-blockquote:border-l-primary/50 max-w-none">
            {content.content.map((node: any, index: number) => (
                <Node key={index} node={node} />
            ))}
        </div>
    )
}

function Node({ node }: { node: any }) {
    switch (node.type) {
        case 'heading':
            const level = Number(node.attrs?.level || 2)
            if (level === 1) return <h1 className="text-4xl md:text-5xl font-bold mt-12 mb-6 text-white font-display">{renderText(node.content)}</h1>
            if (level === 2) return <h2 className="text-3xl md:text-4xl font-bold mt-10 mb-5 text-white font-display">{renderText(node.content)}</h2>
            if (level === 3) return <h3 className="text-2xl md:text-3xl font-bold mt-8 mb-4 text-white font-display">{renderText(node.content)}</h3>
            if (level === 4) return <h4 className="text-xl md:text-2xl font-bold mt-6 mb-3 text-white font-display">{renderText(node.content)}</h4>
            if (level === 5) return <h5 className="text-lg md:text-xl font-bold mt-4 mb-2 text-white font-display">{renderText(node.content)}</h5>
            if (level === 6) return <h6 className="text-base md:text-lg font-bold mt-4 mb-2 text-white font-display">{renderText(node.content)}</h6>
            return <h2 className="text-3xl md:text-4xl font-bold mt-10 mb-5 text-white font-display">{renderText(node.content)}</h2>

        case 'paragraph':
            return <p className="text-gray-300 leading-relaxed mb-6">{renderText(node.content)}</p>

        case 'bulletList':
            return (
                <ul className="list-disc pl-6 mb-6 space-y-2 text-gray-300 marker:text-primary">
                    {node.content?.map((item: any, i: number) => (
                        <Node key={i} node={item} />
                    ))}
                </ul>
            )

        case 'orderedList':
            return (
                <ol className="list-decimal pl-6 mb-6 space-y-2 text-gray-300 marker:text-primary">
                    {node.content?.map((item: any, i: number) => (
                        <Node key={i} node={item} />
                    ))}
                </ol>
            )

        case 'listItem':
            // List Items usually contain paragraphs in Tiptap, ensure we handle them or just render children
            return <li className="pl-2">{node.content?.map((child: any, i: number) => <Node key={i} node={child} />)}</li>

        case 'blockquote':
            return (
                <blockquote className="border-l-4 border-primary pl-6 py-2 italic my-8 text-gray-400 bg-white/5 rounded-r-lg">
                    {node.content?.map((child: any, i: number) => <Node key={i} node={child} />)}
                </blockquote>
            )

        case 'codeBlock':
            // For simplicity in this renderer, we could just render raw content 
            // or try to highlight. Since we used extension-code-block-lowlight in editor,
            // the data structure is standard codeBlock with language param.
            // We can use the lowlight library to highlight. 
            // For now, let's keep it simple and clean:
            const language = node.attrs?.language || 'text'
            let codeContent = ''
            if (node.content && node.content[0] && node.content[0].text) {
                codeContent = node.content[0].text
            }
            return (
                <pre className="not-prose bg-[#111] border border-[#333] rounded-lg p-4 overflow-x-auto my-6">
                    <code className={cn("text-sm font-mono text-gray-200", `language-${language}`)}>
                        {codeContent}
                    </code>
                </pre>
            )

        case 'image':
            if (!node.attrs?.src) return null
            return (
                <div className="my-8 rounded-xl overflow-hidden border border-[#333]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={node.attrs.src}
                        alt={node.attrs.alt || ''}
                        className="w-full h-auto"
                    />
                    {node.attrs.title && (
                        <p className="text-center text-sm text-gray-500 mt-2 italic">{node.attrs.title}</p>
                    )}
                </div>
            )

        case 'horizontalRule':
            return <hr className="border-[#333] my-8" />

        default:
            return null
    }
}

function renderText(content: any[]) {
    if (!content) return null
    return content.map((item: any, index: number) => {
        if (item.type === 'text') {
            let text: React.ReactNode = <span key={index}>{item.text}</span>

            if (item.marks) {
                item.marks.forEach((mark: any) => {
                    if (mark.type === 'bold') {
                        text = <strong key={index}>{text}</strong>
                    } else if (mark.type === 'italic') {
                        text = <em key={index}>{text}</em>
                    } else if (mark.type === 'strike') {
                        text = <s key={index}>{text}</s>
                    } else if (mark.type === 'code') {
                        text = <code key={index} className="bg-white/10 rounded px-1 py-0.5 text-sm font-mono">{item.text}</code>
                    } else if (mark.type === 'link') {
                        text = (
                            <a
                                key={index}
                                href={mark.attrs?.href || '#'}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary hover:underline underline-offset-4"
                            >
                                {item.text}
                            </a>
                        )
                    }
                })
            }
            return text
        } else if (item.type === 'image') {
            if (!item.attrs?.src) return null
            return (
                <span key={index} className="inline-block w-full my-4 rounded-xl overflow-hidden border border-[#333]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={item.attrs.src}
                        alt={item.attrs.alt || ''}
                        className="w-full h-auto"
                    />
                </span>
            )
        } else if (item.type === 'hardBreak') {
            return <br key={index} />
        }
        return null
    })
}
