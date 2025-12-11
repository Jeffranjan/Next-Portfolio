"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Send, Loader2 } from "lucide-react";

export default function ContactForm() {
    const [formState, setFormState] = useState({ name: "", email: "", message: "" });
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus("loading");

        try {
            const res = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formState),
            });

            if (res.ok) {
                setStatus("success");
                setFormState({ name: "", email: "", message: "" });
            } else {
                setStatus("error");
            }
        } catch {
            setStatus("error");
        }
    };

    return (
        <section className="py-20 px-6 md:px-20 w-full relative z-10 flex flex-col items-center bg-[#050505]">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />

            <div className="mb-12 text-center font-mono">
                <div className="flex items-center justify-center gap-2 text-secondary text-sm mb-2">
                    <span className="text-primary">$</span> ./connect_user.sh
                </div>
                <h2 className="text-4xl md:text-5xl font-bold font-display text-white">
                    Initialize <span className="text-primary">Connection</span>
                </h2>
            </div>

            <motion.form
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                onSubmit={handleSubmit}
                className="w-full max-w-lg space-y-8 relative z-10 font-mono"
            >
                <div className="space-y-2 group">
                    <label htmlFor="name" className="text-sm text-gray-500 uppercase tracking-widest flex items-center gap-2">
                        <span className="w-2 h-2 bg-gray-700 rounded-full group-focus-within:bg-primary transition-colors" />
                        var <span className="text-white normal-case">sender_name</span>: string
                    </label>
                    <div className="relative">
                        <span className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-600">{`>`}</span>
                        <input
                            type="text"
                            id="name"
                            required
                            placeholder="_"
                            value={formState.name}
                            onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                            className="w-full bg-transparent border-b border-gray-800 py-3 pl-6 text-white text-lg focus:outline-none focus:border-primary transition-colors placeholder-gray-800"
                        />
                    </div>
                </div>

                <div className="space-y-2 group">
                    <label htmlFor="email" className="text-sm text-gray-500 uppercase tracking-widest flex items-center gap-2">
                        <span className="w-2 h-2 bg-gray-700 rounded-full group-focus-within:bg-primary transition-colors" />
                        var <span className="text-white normal-case">sender_email</span>: string
                    </label>
                    <div className="relative">
                        <span className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-600">{`>`}</span>
                        <input
                            type="email"
                            id="email"
                            required
                            placeholder="_"
                            value={formState.email}
                            onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                            className="w-full bg-transparent border-b border-gray-800 py-3 pl-6 text-white text-lg focus:outline-none focus:border-primary transition-colors placeholder-gray-800"
                        />
                    </div>
                </div>

                <div className="space-y-2 group">
                    <label htmlFor="message" className="text-sm text-gray-500 uppercase tracking-widest flex items-center gap-2">
                        <span className="w-2 h-2 bg-gray-700 rounded-full group-focus-within:bg-primary transition-colors" />
                        var <span className="text-white normal-case">message_payload</span>: string
                    </label>
                    <div className="relative">
                        <span className="absolute left-0 top-3 text-gray-600">{`>`}</span>
                        <textarea
                            id="message"
                            required
                            rows={5}
                            placeholder="_"
                            value={formState.message}
                            onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                            className="w-full bg-transparent border-b border-gray-800 py-3 pl-6 text-white text-lg focus:outline-none focus:border-primary transition-colors resize-none placeholder-gray-800"
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={status === "loading" || status === "success"}
                    className="w-full py-4 bg-primary/10 border border-primary text-primary font-bold hover:bg-primary hover:text-black transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider"
                >
                    {status === "loading" ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                    ) : status === "success" ? (
                        "Status: 200 OK"
                    ) : (
                        <>
                            {`>`} Execute_Send()
                        </>
                    )}
                </button>

                {status === "error" && (
                    <p className="text-red-500 text-center text-sm font-mono mt-4"> Error: 500 Internal Server Error</p>
                )}
            </motion.form>
        </section>
    );
}
