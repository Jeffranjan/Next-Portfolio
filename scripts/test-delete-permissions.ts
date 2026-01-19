
import { createAdminClient } from '../src/lib/supabase/admin'

async function testDeletePermission() {
    console.log('Testing Admin Client Delete Permission...')
    try {
        const supabase = createAdminClient()
        // Try to update a non-existent blog to check for permission errors vs "row not found" (which is success)
        const { error, count } = await supabase
            .from('blogs')
            .update({ deleted_at: new Date().toISOString() })
            .eq('id', '00000000-0000-0000-0000-000000000000') // Dummy ID
            .select()

        if (error) {
            console.error('❌ Admin Client Error:', error.message)
        } else {
            console.log('✅ Admin Client Permission Verified (No error returned for update attempt)')
        }
    } catch (e) {
        console.error('❌ Exception:', e)
    }
}

testDeletePermission()
