import React from "react";
import { Link } from "react-router-dom";

export default function TopBar({ token, onOpenAuth, onLogout }) {
    const btn = { padding: "10px 12px", cursor: "pointer" };

    return (
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 18 }}>
            <div>
                <h1 style={{ margin: 10 }}>Memory Quest</h1>
                <div style={{ margin:10, opacity: 0.7 }}>Decks</div>
            </div>

            <div style={{ display: "flex", gap: 8, margin: 15 }}>
                {token ? (
                    <>
                        <button style={btn} onClick={onOpenAuth}>Account</button>
                        <button style={btn} onClick={onLogout}>Logout</button>

                        
                    </>
                ) : (
                    <button style={btn} onClick={onOpenAuth}>Login</button>
                )}
            </div>
        </div>
    );
}

