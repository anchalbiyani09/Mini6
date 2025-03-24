// import React, { useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import { db } from "../firebaseConfig"; // Import Firestore instance
// import { collection, doc, setDoc } from "firebase/firestore"; // Firestore methods
// import '../styles/AuthPage.css';

// function AuthPage({ setUser }) {  
//   const [isRegistered, setIsRegistered] = useState(true);
//   const [ngoName, setNgoName] = useState("");
//   const [ngoEmail, setNgoEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [otp, setOtp] = useState("");
//   const [message, setMessage] = useState("");
//   const [step, setStep] = useState("initial");
//   const [passwordStrength, setPasswordStrength] = useState({
//     isStrong: false,
//     message: "",
//     requirements: { length: false, uppercase: false, lowercase: false, number: false, special: false }
//   });

//   const navigate = useNavigate();

//   const toggleForm = () => {
//     setIsRegistered(!isRegistered);
//     setMessage("");
//     setStep("initial");
//     setNgoName("");
//     setNgoEmail("");
//     setPassword("");
//     setOtp("");
//     setPasswordStrength({
//       isStrong: false,
//       message: "",
//       requirements: { length: false, uppercase: false, lowercase: false, number: false, special: false }
//     });
//   };

//   const validatePasswordStrength = (password) => {
//     const requirements = {
//       length: password.length >= 6,
//     //   uppercase: /[A-Z]/.test(password),
//     //   lowercase: /[a-z]/.test(password),
//     //   number: /[0-9]/.test(password),
//     //   special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)
//     };

//     const isStrong = Object.values(requirements).every(Boolean);
//     setPasswordStrength({ isStrong, message: isStrong ? "Strong password" : "Password must meet all requirements", requirements });
//     return isStrong;
//   };

//   const handleVerification = async () => {
//     try {
//       if (isRegistered) {
//         // Login process
//         const response = await axios.post("http://127.0.0.1:5000/login", { email: ngoEmail, password });

//         if (response.status === 200) {
//           const userData = { email: ngoEmail, name: response.data.ngo_name, uid: response.data.uid };

//           // Save user data
//           sessionStorage.setItem("userData", JSON.stringify(userData));
//           setUser(userData); // Update App.js state
//           navigate("/ngo-dashboard"); // Redirect to dashboard
//         }
//       } else {
//         // NGO verification flow (for new users)
//         const response = await axios.post("http://127.0.0.1:5000/verify-ngo", { ngo_name: ngoName, ngo_email: ngoEmail });

//         if (response.status === 200) {
//           sessionStorage.setItem("temp_ngo_email", ngoEmail);
//           sessionStorage.setItem("temp_ngo_name", ngoName);
//           setStep("otp");
//           setMessage("OTP sent to your email");
//         }
//       }
//     } catch (error) {
//       setMessage(error.response?.data?.detail || "An error occurred");
//     }
//   };

//   const verifyOTP = async () => {
//     try {
//       const response = await axios.post("http://127.0.0.1:5000/verify-otp", { ngo_email: ngoEmail, otp });

//       if (response.status === 200) {
//         setStep("signup");
//         setMessage("OTP verified successfully. Please set your password.");
//       }
//     } catch (error) {
//       setMessage(error.response?.data?.detail || "Invalid OTP");
//     }
//   };

//   const handleSignup = async () => {
//     if (!validatePasswordStrength(password)) {
//       setMessage("Please create a stronger password");
//       return;
//     }

//     try {
//       const response = await axios.post("http://127.0.0.1:5000/complete-signup", { ngo_email: ngoEmail, password });

//       if (response.status === 200) {
//         const userData = { email: ngoEmail, name: response.data.ngo_name, uid: response.data.uid };

//         // Store user data in Firestore
//         const userRef = doc(collection(db, "users"), userData.uid);
//         await setDoc(userRef, {
//           name: userData.name,
//           email: userData.email,
//           uid: userData.uid,
//           createdAt: new Date()
//         });

//         // Store user data and update state
//         sessionStorage.setItem("userData", JSON.stringify(userData));
//         setUser(userData);
//         navigate("/ngo-dashboard");
//       }
//     } catch (error) {
//       setMessage(error.response?.data?.detail || "Registration failed");
//     }
//   };

//   return (
//     <div className="verification-container">
//       <h2>{isRegistered ? "NGO Login" : "NGO Verification"}</h2>

//       {step === "initial" && (
//         <div className="form-container">
//           {!isRegistered && (
//             <div className="form-group">
//               <label htmlFor="ngo-name">NGO Name</label>
//               <input
//                 id="ngo-name"
//                 type="text"
//                 placeholder="NGO Name"
//                 value={ngoName}
//                 onChange={(e) => setNgoName(e.target.value)}
//                 required
//               />
//             </div>
//           )}

//           <div className="form-group">
//             <label htmlFor="ngo-email">Email</label>
//             <input
//               id="ngo-email"
//               type="email"
//               placeholder="NGO Email"
//               value={ngoEmail}
//               onChange={(e) => setNgoEmail(e.target.value)}
//               required
//             />
//           </div>

//           {isRegistered && (
//             <div className="form-group">
//               <label htmlFor="password">Password</label>
//               <input
//                 id="password"
//                 type="password"
//                 placeholder="Password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 required
//               />
//             </div>
//           )}

//           <button className="form-button" onClick={handleVerification}>
//             {isRegistered ? "Login" : "Verify NGO"}
//           </button>
//         </div>
//       )}

//       {step === "otp" && (
//         <div className="form-container">
//           <p className="info-text">Please enter the OTP sent to your email</p>
//           <div className="form-group">
//             <label htmlFor="otp">OTP</label>
//             <input
//               id="otp"
//               type="text"
//               placeholder="Enter OTP"
//               value={otp}
//               onChange={(e) => setOtp(e.target.value)}
//               required
//             />
//           </div>
//           <button className="form-button" onClick={verifyOTP}>Verify OTP</button>
//         </div>
//       )}

//       {step === "signup" && (
//         <div className="form-container">
//           <p className="info-text">Set your password to complete registration</p>
//           <div className="form-group">
//             <label htmlFor="new-password">Create Password</label>
//             <input
//               id="new-password"
//               type="password"
//               placeholder="Create Password"
//               value={password}
//               onChange={(e) => {
//                 setPassword(e.target.value);
//                 validatePasswordStrength(e.target.value);
//               }}
//               required
//             />
//           </div>
//           <button className="form-button" onClick={handleSignup}>Complete Registration</button>
//         </div>
//       )}

//       {message && <p className={message.includes("success") ? "success-message" : "error-message"}>{message}</p>}

//       <p onClick={toggleForm} className="toggle-form">
//         {isRegistered ? "Don't have an account? Register here" : "Already have an account? Login here"}
//       </p>
//     </div>
//   );
// }

// export default AuthPage;
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { db } from "../firebaseConfig.js"; // Import Firestore instance
import { collection, doc, setDoc } from "firebase/firestore"; // Firestore methods
import '../styles/AuthPage.css';
import './AdminPanel.js'

function AuthPage({ setUser }) {  
  const [isRegistered, setIsRegistered] = useState(true);
  const [ngoName, setNgoName] = useState("");
  const [ngoEmail, setNgoEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [step, setStep] = useState("initial");
  const [passwordStrength, setPasswordStrength] = useState({
    isStrong: false,
    message: "",
    requirements: { length: false, uppercase: false, lowercase: false, number: false, special: false }
  });

  const navigate = useNavigate();

  const toggleForm = () => {
    setIsRegistered(!isRegistered);
    setMessage("");
    setStep("initial");
    setNgoName("");
    setNgoEmail("");
    setPassword("");
    setOtp("");
    setPasswordStrength({
      isStrong: false,
      message: "",
      requirements: { length: false, uppercase: false, lowercase: false, number: false, special: false }
    });
  };

  const validatePasswordStrength = (password) => {
    const requirements = {
      length: password.length >= 6,
    //   uppercase: /[A-Z]/.test(password),
    //   lowercase: /[a-z]/.test(password),
    //   number: /[0-9]/.test(password),
    //   special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)
    };

    const isStrong = Object.values(requirements).every(Boolean);
    setPasswordStrength({ isStrong, message: isStrong ? "Strong password" : "Password must meet all requirements", requirements });
    return isStrong;
  };

  const handleVerification = async () => {
    try {
      if (isRegistered) {
        // Login process
        const response = await axios.post("http://127.0.0.1:5000/login", { email: ngoEmail, password });

        if (response.status === 200) {
          const userData = { email: ngoEmail, name: response.data.ngo_name, uid: response.data.uid };

          // Save user data
          sessionStorage.setItem("userData", JSON.stringify(userData));
          setUser(userData); // Update App.js state
          
          // Check if email is admin and redirect accordingly
          if (ngoEmail === "admin@example.com") {
            navigate("/admin"); 
          } else {
            navigate("/ngo-dashboard"); // Redirect to dashboard
          }
        }
      } else {
        // NGO verification flow (for new users)
        const response = await axios.post("http://127.0.0.1:5000/verify-ngo", { ngo_name: ngoName, ngo_email: ngoEmail });

        if (response.status === 200) {
          sessionStorage.setItem("temp_ngo_email", ngoEmail);
          sessionStorage.setItem("temp_ngo_name", ngoName);
          setStep("otp");
          setMessage("OTP sent to your email");
        }
      }
    } catch (error) {
      setMessage(error.response?.data?.detail || "An error occurred");
    }
  };

  const verifyOTP = async () => {
    try {
      const response = await axios.post("http://127.0.0.1:5000/verify-otp", { ngo_email: ngoEmail, otp });

      if (response.status === 200) {
        setStep("signup");
        setMessage("OTP verified successfully. Please set your password.");
      }
    } catch (error) {
      setMessage(error.response?.data?.detail || "Invalid OTP");
    }
  };

  const handleSignup = async () => {
    if (!validatePasswordStrength(password)) {
      setMessage("Please create a stronger password");
      return;
    }

    try {
      const response = await axios.post("http://127.0.0.1:5000/complete-signup", { ngo_email: ngoEmail, password });

      if (response.status === 200) {
        const userData = { email: ngoEmail, name: response.data.ngo_name, uid: response.data.uid };

        // Store user data in Firestore
        const userRef = doc(collection(db, "users"), userData.uid);
        await setDoc(userRef, {
          name: userData.name,
          email: userData.email,
          uid: userData.uid,
          createdAt: new Date()
        });

        // Store user data and update state
        sessionStorage.setItem("userData", JSON.stringify(userData));
        setUser(userData);
        navigate("/ngo-dashboard");
      }
    } catch (error) {
      setMessage(error.response?.data?.detail || "Registration failed");
    }
  };

  return (
    <div className="verification-container">
      <h2>{isRegistered ? "NGO Login" : "NGO Verification"}</h2>

      {step === "initial" && (
        <div className="form-container">
          {!isRegistered && (
            <div className="form-group">
              <label htmlFor="ngo-name">NGO Name</label>
              <input
                id="ngo-name"
                type="text"
                placeholder="NGO Name"
                value={ngoName}
                onChange={(e) => setNgoName(e.target.value)}
                required
              />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="ngo-email">Email</label>
            <input
              id="ngo-email"
              type="email"
              placeholder="NGO Email"
              value={ngoEmail}
              onChange={(e) => setNgoEmail(e.target.value)}
              required
            />
          </div>

          {isRegistered && (
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          )}

          <button className="form-button" onClick={handleVerification}>
            {isRegistered ? "Login" : "Verify NGO"}
          </button>
        </div>
      )}

      {step === "otp" && (
        <div className="form-container">
          <p className="info-text">Please enter the OTP sent to your email</p>
          <div className="form-group">
            <label htmlFor="otp">OTP</label>
            <input
              id="otp"
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
          </div>
          <button className="form-button" onClick={verifyOTP}>Verify OTP</button>
        </div>
      )}

      {step === "signup" && (
        <div className="form-container">
          <p className="info-text">Set your password to complete registration</p>
          <div className="form-group">
            <label htmlFor="new-password">Create Password</label>
            <input
              id="new-password"
              type="password"
              placeholder="Create Password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                validatePasswordStrength(e.target.value);
              }}
              required
            />
          </div>
          <button className="form-button" onClick={handleSignup}>Complete Registration</button>
        </div>
      )}

      {message && <p className={message.includes("success") ? "success-message" : "error-message"}>{message}</p>}

      <p onClick={toggleForm} className="toggle-form">
        {isRegistered ? "Don't have an account? Register here" : "Already have an account? Login here"}
      </p>
    </div>
  );
}

export default AuthPage;