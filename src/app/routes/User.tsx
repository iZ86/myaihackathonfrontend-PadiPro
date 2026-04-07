import UserTable from "@features/user/components/UserTable";


export default function User() {
  
  return (
    <div className="flex min-h-screen bg-white-antiflash font-poppins justify-center items-center">
      <h1>User Table</h1>
      <UserTable />
    </div>
  );
}
