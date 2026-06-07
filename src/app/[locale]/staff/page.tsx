import { StaffLayout } from '@/components/staff/StaffLayout'
import { IncomingCallAlert } from '@/components/staff/IncomingCallAlert'
import { StaffCallOut } from '@/components/staff/StaffCallOut'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

export default async function StaffDashboard() {
  return (
    <StaffLayout>
      <Header />
      <IncomingCallAlert />
      <main className="max-w-4xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">スタッフダッシュボード</h1>
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <p className="text-sm text-gray-500">待機中... 着信があると右下に通知が表示されます。</p>
        </div>
        <StaffCallOut />
      </main>
      <Footer />
    </StaffLayout>
  )
}
