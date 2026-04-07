import type { UserData } from "@datatypes/userType";
import { useEffect, useState } from "react";
import { getUsersAPI } from "../api/users";


export default function UserTable() {

  const [users, setUsers] = useState<UserData[]>([]);


  useEffect(() => {
    const getUsers = async (token: string) => {
      const response: Response | undefined = await getUsersAPI(token);

      if (response) {
        if (response.ok) {
          const responseJson = await response.json();
          setUsers(responseJson.data);
          return;
        }
      }
      // Ideally if the response is not good, would give an error page.
      // But for this example just put empty data.
      setUsers([]);
    }

    getUsers("randomToken");

  }, [])

  return (
    <table>
      <thead>
        <tr>
          <th>userId</th>
          <th>username</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user) => (
          <tr key={user.userId}>
            <td>{user.userId}</td>
            <td>{user.username}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
