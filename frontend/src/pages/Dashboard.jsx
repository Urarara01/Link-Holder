// Ejemplo básico de un componente de React para el Dashboard
import React from 'react';
import { useAuth } from '../auth/HookAuth';
import NavDashboard from '../components/NavDashboard';
import './Dashboard.css';

export default function Dashboard() {
    const { user, logout } = useAuth();

    return (
        <>
        <NavDashboard user={user} logout={logout} />
        </>
    );
}