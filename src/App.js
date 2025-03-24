// import React, { useState, useEffect } from "react";
// import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
// import { BrowserProvider } from "ethers";
// import { auth, signOut } from "./firebaseConfig";
// import { onAuthStateChanged } from "firebase/auth";
// import LandingPage from "./components/LandingPage";
// import NGODashboard from "./components/NGODashboard";
// import DonationPage from "./components/DonationPage";
// import AdminPanel from "./components/AdminPanel";
// import About from "./pages/About";
// import Campaigns from "./pages/Campaigns";
// import Features from "./pages/Features";
// import Contact from "./pages/Contact";
// import Navbar from "./components/Navbar";
// import AuthPage from "./components/AuthPage";
// import "./App.css";

// const ADMIN_EMAIL ="admin@example.com";

// function App() {
//   const [currentAccount, setCurrentAccount] = useState(localStorage.getItem("walletAddress") || null);
//   const [user, setUser] = useState(JSON.parse(localStorage.getItem("userData")) || null);

//   useEffect(() => {
//     checkWalletConnection();
    
//     // Listen for authentication changes
//     const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
//       if (firebaseUser) {
//         setUser(firebaseUser);
//         localStorage.setItem("userData", JSON.stringify(firebaseUser));
//       } else {
//         setUser(null);
//         localStorage.removeItem("userData");
//       }
//     });

//     return () => unsubscribe(); // Cleanup
//   }, []);

//   async function checkWalletConnection() {
//     if (window.ethereum) {
//       const accounts = await window.ethereum.request({ method: "eth_accounts" });
//       if (accounts.length > 0) {
//         setCurrentAccount(accounts[0]);
//         localStorage.setItem("walletAddress", accounts[0]);
//       }
//     }
//   }

//   async function connectWallet() {
//     if (!window.ethereum) return alert("MetaMask not detected!");
//     const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
//     setCurrentAccount(accounts[0]);
//     localStorage.setItem("walletAddress", accounts[0]);
//   }

//   function logout() {
//     signOut(auth);
//     setUser(null);
//     setCurrentAccount(null);
//     localStorage.removeItem("userData");
//     localStorage.removeItem("walletAddress");
//   }

//   return (
//     <Router>
//       <div className="app">
//         <Navbar user={user} logout={logout} />

//         <header className="app-header">
//           <div className="auth-section">
//             {!currentAccount ? (
//               <button onClick={connectWallet} className="wallet-button">
//                 Connect MetaMask
//               </button>
//             ) : (
//               <div className="wallet-info">
//                 Connected: {currentAccount.slice(0, 6)}...{currentAccount.slice(-4)}
//               </div>
//             )}
//           </div>
//         </header>

//         <main>
//           <Routes>
//             <Route path="/" element={<LandingPage />} />
//             <Route path="/donate" element={<DonationPage currentAccount={currentAccount} />} />
//             <Route path="/about" element={<About />} />
//             <Route path="/campaigns" element={<Campaigns />} />
//             <Route path="/features" element={<Features />} />
//             <Route path="/contact" element={<Contact />} />
//             <Route path="/auth" element={<AuthPage setUser={setUser} />} />
            
//             {/* Protected NGO Dashboard Route */}
//             <Route
//               path="/ngo-dashboard"
//               element={user ? <NGODashboard user={user} currentAccount={currentAccount} /> : <Navigate to="/auth" replace />}
//             />

//             {/* Protected Admin Panel Route */}
//             <Route
//               path="/admin"
//               element={user?.email === ADMIN_EMAIL ? <AdminPanel /> : <Navigate to="/auth" replace />}
//             />
//           </Routes>
//         </main>

//         <footer>
//           <p>© 2025 Blockchain Crowdfunding</p>
//         </footer>
//       </div>
//     </Router>
//   );
// }

// export default App;

// import React, { useState, useEffect } from "react";
// import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
// import { BrowserProvider } from "ethers";
// import { auth, signOut } from "./firebaseConfig";
// import { onAuthStateChanged } from "firebase/auth";
// import LandingPage from "./components/LandingPage";
// import NGODashboard from "./components/NGODashboard";
// import DonationPage from "./components/DonationPage";
// import AdminPanel from "./components/AdminPanel";
// import About from "./pages/About";
// import Campaigns from "./pages/Campaigns";
// import Features from "./pages/Features";
// import Contact from "./pages/Contact";
// import Navbar from "./components/Navbar";
// import AuthPage from "./components/AuthPage";
// import "./App.css";

// const ADMIN_EMAIL = "admin@example.com";

// function App() {
//   const [currentAccount, setCurrentAccount] = useState(localStorage.getItem("walletAddress") || null);
//   const [user, setUser] = useState(JSON.parse(localStorage.getItem("userData")) || null);

//   useEffect(() => {
//     checkWalletConnection();
    
//     // Listen for authentication changes
//     const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
//       if (firebaseUser) {
//         setUser(firebaseUser);
//         localStorage.setItem("userData", JSON.stringify(firebaseUser));
//       } else {
//         setUser(null);
//         localStorage.removeItem("userData");
//       }
//     });

//     return () => unsubscribe(); // Cleanup
//   }, []);

//   async function checkWalletConnection() {
//     if (window.ethereum) {
//       const accounts = await window.ethereum.request({ method: "eth_accounts" });
//       if (accounts.length > 0) {
//         setCurrentAccount(accounts[0]);
//         localStorage.setItem("walletAddress", accounts[0]);
//       }
//     }
//   }

//   async function connectWallet() {
//     if (!window.ethereum) return alert("MetaMask not detected!");
//     const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
//     setCurrentAccount(accounts[0]);
//     localStorage.setItem("walletAddress", accounts[0]);
//   }

//   function logout() {
//     signOut(auth);
//     setUser(null);
//     setCurrentAccount(null);
//     localStorage.removeItem("userData");
//     localStorage.removeItem("walletAddress");
//   }

//   return (
//     <Router>
//       <div className="app">
//         <Navbar user={user} logout={logout} />

//         <header className="app-header">
//           <div className="auth-section">
//             {!currentAccount ? (
//               <button onClick={connectWallet} className="wallet-button">
//                 Connect MetaMask
//               </button>
//             ) : (
//               <div className="wallet-info">
//                 Connected: {currentAccount.slice(0, 6)}...{currentAccount.slice(-4)}
//               </div>
//             )}
//           </div>
//         </header>

//         <main>
//           <Routes>
//             <Route path="/" element={<LandingPage />} />
//             <Route path="/donate" element={<DonationPage currentAccount={currentAccount} />} />
//             <Route path="/about" element={<About />} />
//             <Route path="/campaigns" element={<Campaigns />} />
//             <Route path="/features" element={<Features />} />
//             <Route path="/contact" element={<Contact />} />
//             <Route path="/auth" element={<AuthPage setUser={setUser} />} />
            

//             {/* Protected NGO Dashboard Route */}
//             <Route
//               path="/ngo-dashboard"
//               element={user ? <NGODashboard user={user} currentAccount={currentAccount} /> : <Navigate to="/auth" replace />}
//             />

//             {/* Protected Admin Panel Route */}
//             <Route
//               path="/admin"
//               element={user?.email === ADMIN_EMAIL ? <AdminPanel /> : <Navigate to="/auth" replace />}
//             />
//           </Routes>
//         </main>

//         <footer>
//           <p>© 2025 Blockchain Crowdfunding</p>
//         </footer>
//       </div>
//     </Router>
//   );
// }

// export default App;
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { BrowserProvider } from "ethers";
import { auth, signOut } from "./firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import LandingPage from "./components/LandingPage";
import NGODashboard from "./components/NGODashboard";
import DonationPage from "./components/DonationPage";
import AdminPanel from "./components/AdminPanel";
import About from "./pages/About";
import Campaigns from "./pages/Campaigns";
import Features from "./pages/Features";
import Contact from "./pages/Contact";
import Navbar from "./components/Navbar";
import AuthPage from "./components/AuthPage";
import Footer from "./components/Footer";
import "./App.css";

const ADMIN_EMAIL = "admin@example.com";

function App() {
  const [currentAccount, setCurrentAccount] = useState(localStorage.getItem("walletAddress") || null);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("userData")) || null);

  useEffect(() => {
    checkWalletConnection();

    // Listen for authentication changes
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        localStorage.setItem("userData", JSON.stringify(firebaseUser));
      } else {
        setUser(null);
        localStorage.removeItem("userData");
      }
    });

    return () => unsubscribe(); // Cleanup
  }, []);

  async function checkWalletConnection() {
    if (window.ethereum) {
      const accounts = await window.ethereum.request({ method: "eth_accounts" });
      if (accounts.length > 0) {
        setCurrentAccount(accounts[0]);
        localStorage.setItem("walletAddress", accounts[0]);
      }
    }
  }

  async function connectWallet() {
    if (!window.ethereum) return alert("MetaMask not detected!");
    const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
    setCurrentAccount(accounts[0]);
    localStorage.setItem("walletAddress", accounts[0]);
  }

  function logout() {
    signOut(auth);
    setUser(null);
    setCurrentAccount(null);
    localStorage.removeItem("userData");
    localStorage.removeItem("walletAddress");
  }

  return (
    <Router>
      <div className="app">
        <Navbar 
          user={user} 
          logout={logout} 
          currentAccount={currentAccount} 
          connectWallet={connectWallet} 
        />

        <main>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/donate" element={<DonationPage currentAccount={currentAccount} />} />
            <Route path="/about" element={<About />} />
            <Route path="/campaigns" element={<Campaigns />} />
            <Route path="/features" element={<Features />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/auth" element={<AuthPage setUser={setUser} />} />

            {/* Protected NGO Dashboard Route */}
            <Route
              path="/ngo-dashboard"
              element={user ? <NGODashboard user={user} currentAccount={currentAccount} /> : <Navigate to="/auth" replace />}
            />

            {/* Protected Admin Panel Route */}
            <Route
              path="/admin"
              element={(user?.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase()) 
                ? <AdminPanel /> 
                : <Navigate to="/auth" replace />}
            />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;