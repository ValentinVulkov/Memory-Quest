import React from "react";

export default function TopBar({ token, onOpenAuth, onLogout }) {
    return (
        <div className="topbar">
            <div className="topbar-left">
                <div className="brand">Memory Quest</div>
                <div className="subtitle">Decks</div>
            </div>

            <div className="topbar-right">
                {token ? (
                    <>
                        <button type="button" onClick={onOpenAuth}>Account</button>
                        <button type="button" onClick={onLogout}>Logout</button>
                    </>
                ) : (
                    <button type="button" onClick={onOpenAuth}>Login</button>
                )}
            </div>
        </div>
    );
}
