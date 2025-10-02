import Link from "next/link"
import DashboardPage from "./main/dashboard/page"
import MainLayout from "./main/layout"

const HomePage = () => {
  return (
    <div>
      <MainLayout>

      <DashboardPage/>
      </MainLayout>
    </div>
  )
}

export default HomePage
