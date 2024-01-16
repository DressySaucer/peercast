import React from "react";

export function Navbar() {
    return (
        <div id="navbar">
            <div>
                <div id="navbar-top">
                    <div id="navbar-icon"></div>
                    <div id="navbar-divider"></div>
                    <div id="navbar-top-buttons">
                        <button className="navbar-button" id="home-page-button">
                            <div></div>
                        </button>
                        <button
                            className="navbar-button"
                            id="connect-page-button"
                        >
                            <div></div>
                        </button>
                        <button
                            className="navbar-button-ex"
                            id="devices-page-button"
                        >
                            <div></div>
                        </button>
                        <button
                            className="navbar-button-ex"
                            id="dev-page-button"
                        >
                            <div></div>
                        </button>
                    </div>
                </div>
                <div id="navbar-bottom">
                    <button
                        className="navbar-button-ex"
                        id="support-page-button"
                    >
                        <div></div>
                    </button>
                    <button
                        className="navbar-button-ex"
                        id="settings-page-button"
                    >
                        <div></div>
                    </button>
                    <button className="navbar-button-ex" id="help-page-button">
                        <div></div>
                    </button>
                    <button
                        className="navbar-button-ex"
                        id="navbar-toggle-button"
                    >
                        <div></div>
                    </button>
                </div>
            </div>
        </div>
    );
}
