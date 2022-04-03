import React, { FC, useContext, useEffect, useState } from 'react';
import LoginForm from "./components/LoginForm";
import { Context } from "./index";
import { observer } from "mobx-react-lite";
import { IUser } from "./models/IUser";
import UserService from "./service/UserService";

const App: FC = () => {
  const { store } = useContext(Context);
  const [users, setUsers] = useState<IUser[]>([]);

  useEffect(() => {
    if (localStorage.getItem('token')) {
      store.checkAuth()
    }
  }, [])

  async function getUsers() {
    try {
      const response = await UserService.fetchUsers();
      setUsers(response.data)
      console.log(response.data);
    } catch (e) {
      console.log(e);
    }
  }

  if (store.isLoading) {
    return <div>Перекур 5 мин...</div>
  }

  if (!store.isAuth) {
    return (
      <div>
        <LoginForm />
      </div>
    )
  }

  return (
    <div>
      <h1>{store.isAuth ? `Пользователь авторизован ${store.user.email}` : "А НУ БЫРА АВТОРИЗУЙСЯ, МЫШЪ"}</h1>
      <h1>{store.user.isActivated ? 'Аккаунт подтверждён по голубиной почте (пожалуйста, покормите голубя и отправьте обрано)' : 'Голубь с письмом для подтверждения в пути. Следи за голубятней'}</h1>
      <button onClick={() => store.logout()}>Сбежатб</button>
      <div>
        <button onClick={getUsers}>Получить список пользователей</button>
      </div>
      {users.map(user =>
        <div key={user.email}>{user.email}</div>
      )}
    </div>
  );
};

export default observer(App);