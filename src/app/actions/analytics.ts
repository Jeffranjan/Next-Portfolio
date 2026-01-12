'use server'

import { createClient } from '@/lib/supabase/server'
import { headers } from 'next/headers'

export async function trackView(data: { path: string; referrer: string; session_id: string }) {
    const supabase = await createClient()

    // We can assume strict RLS policies allow anonymous inserts
    await supabase.from('page_views').insert({
        path: data.path,
        referrer: data.referrer,
        session_id: data.session_id
    })
}

export async function trackVisitor(data: {
    session_id: string;
    user_agent: string;
    device_type: string;
    browser: string;
    os: string
}) {
    const supabase = await createClient()

    // Use ignoreDuplicates (on conflict) to avoid error if session already exists
    // But supabase-js .insert() doesn't have onConflict unless we use upsert
    // RLS allows inserts. Let's use upsert or ignore error.

    // Actually, 'session_id' is unique in schema.
    const { error } = await supabase.from('visitors').insert({
        session_id: data.session_id,
        user_agent: data.user_agent,
        device_type: data.device_type,
        browser: data.browser,
        os: data.os
    }).select().single()

    // Ignore duplicate key error (code 23505 in postgres, but supabase error structure might vary)
    // We just want to ensure the visitor is recorded once.
    if (error && error.code !== '23505') {
        console.error('Error tracking visitor:', error)
    }
}

export async function trackEvent(data: { event_name: string; event_data: any; session_id: string }) {
    const supabase = await createClient()

    await supabase.from('events').insert({
        event_name: data.event_name,
        event_data: data.event_data,
        session_id: data.session_id
    })
}
