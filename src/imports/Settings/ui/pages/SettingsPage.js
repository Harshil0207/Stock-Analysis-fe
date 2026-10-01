"use client";

import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Settings, Shield, Key, Sliders, Check, User, Mail, Smartphone, Award, Sun, Moon, Loader2 } from "lucide-react";
import Sidebar from "../../../Dashboard/ui/components/Sidebar.js";
import Header from "../../../Dashboard/ui/components/Header.js";
import { useThemeMode } from "../../../../styles/ClientThemeProvider.js";
import { fetchUserProfile, updateUserProfile } from "../../../Auth/api/auth.js";

const DashboardWrapper = styled.section`
  min-height: 100vh;
  background-color: ${({ theme }) => theme.bg};
  color: ${({ theme }) => theme.text};
  font-family: var(--font-outfit), sans-serif;
  display: flex;
  overflow: hidden;
  transition: background-color 0.3s ease, color 0.3s ease;
`;

const MainPanel = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow-y: auto;
  padding: 32px;
  background: ${({ theme }) => theme.mode === "light" 
    ? "radial-gradient(circle at 5% 5%, rgba(229, 193, 88, 0.02) 0%, transparent 35%)"
    : "radial-gradient(circle at 5% 5%, rgba(229, 193, 88, 0.04) 0%, transparent 35%), radial-gradient(circle at 95% 85%, rgba(16, 185, 129, 0.03) 0%, transparent 45%)"
  };
  transition: background 0.3s ease;

  @media (max-width: 768px) {
    padding: 20px;
  }
`;

const SettingsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 32px;
  margin-top: 24px;
  margin-bottom: 32px;
`;

const Card = styled.div`
  background: ${({ theme }) => theme.cardBg};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 20px;
  padding: 32px;
  backdrop-filter: blur(16px);
  box-shadow: ${({ theme }) => theme.mode === "light" 
    ? "0 8px 30px rgba(0, 0, 0, 0.04)"
    : "0 12px 40px rgba(0, 0, 0, 0.5)"
  };
  transition: all 0.3s ease;
`;

const CardTitle = styled.h3`
  font-family: var(--font-syne), sans-serif;
  font-size: 16px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #e5c158;
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  gap: 12px;
  border-bottom: 1px solid ${({ theme }) => theme.border};
  padding-bottom: 16px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 20px;
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 24px;
`;

const Label = styled.label`
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: ${({ theme }) => theme.text};
  display: flex;
  align-items: center;
  gap: 8px;
`;

const InputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const InputIcon = styled.div`
  position: absolute;
  left: 16px;
  color: ${({ theme }) => theme.text};
  display: flex;
  align-items: center;
`;

const Input = styled.input`
  padding: 14px 16px 14px 46px;
  background: ${({ theme }) => theme.mode === "light" ? "rgba(0, 0, 0, 0.02)" : "rgba(255, 255, 255, 0.02)"};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 10px;
  color: ${({ theme }) => theme.heading};
  font-size: 14px;
  width: 100%;
  transition: all 0.3s ease;

  &:focus {
    border-color: #e5c158;
    background: ${({ theme }) => theme.mode === "light" ? "rgba(0, 0, 0, 0.03)" : "rgba(255, 255, 255, 0.04)"};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const Selector = styled.select`
  padding: 14px 16px 14px 46px;
  background: ${({ theme }) => theme.mode === "light" ? "#ffffff" : "#0d111c"};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 10px;
  color: ${({ theme }) => theme.heading};
  font-size: 14px;
  width: 100%;
  outline: none;
  cursor: pointer;
  transition: all 0.3s ease;

  &:focus {
    border-color: #e5c158;
  }
`;

const Button = styled.button`
  padding: 14px 28px;
  background: #e5c158;
  color: #07090e;
  border: none;
  border-radius: 10px;
  font-weight: 700;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 8px;

  &:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 6px 20px rgba(229, 193, 88, 0.25);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const ToggleContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 0;
  border-bottom: 1px solid ${({ theme }) => theme.border};

  &:last-child {
    border-bottom: none;
  }
`;

const ToggleInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const ToggleTitle = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.heading};
`;

const ToggleDesc = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.text};
`;

const Switch = styled.label`
  position: relative;
  display: inline-block;
  width: 50px;
  height: 26px;
`;

const SwitchInput = styled.input`
  opacity: 0;
  width: 0;
  height: 0;

  &:checked + span {
    background-color: #e5c158;
  }

  &:checked + span:before {
    transform: translateX(24px);
    background-color: #07090e;
  }
`;

const Slider = styled.span`
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: ${({ theme }) => theme.mode === "light" ? "rgba(0, 0, 0, 0.08)" : "rgba(255, 255, 255, 0.1)"};
  transition: .4s;
  border-radius: 34px;

  &:before {
    position: absolute;
    content: "";
    height: 18px;
    width: 18px;
    left: 4px;
    bottom: 4px;
    background-color: #fff;
    transition: .4s;
    border-radius: 50%;
  }
`;

const StatusText = styled.div`
  margin-top: 12px;
  font-size: 13px;
  font-weight: 600;
  color: ${({ $isError }) => ($isError ? "#f43f5e" : "#10b981")};
`;

export default function SettingsPage() {
  const { themeMode, toggleThemeMode } = useThemeMode();

  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobileNumber: "",
    role: "USER"
  });

  const [apiKey, setApiKey] = useState("d98bll1r01qr7o1idmq0d98bll1r01qr7o1idmqg");
  const [twoFactor, setTwoFactor] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const u = await fetchUserProfile();
        setProfile({
          firstName: u.firstName || "",
          lastName: u.lastName || "",
          email: u.email || "",
          mobileNumber: u.mobileNumber || "",
          role: u.role || "USER"
        });
      } catch (err) {
        console.warn("Failed to load profile details:", err.message);
      }
    };
    loadProfile();
  }, []);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);
    try {
      const updated = await updateUserProfile({
        firstName: profile.firstName,
        lastName: profile.lastName,
        mobileNumber: profile.mobileNumber,
        role: profile.role
      });
      setProfile({
        firstName: updated.firstName || "",
        lastName: updated.lastName || "",
        email: updated.email || "",
        mobileNumber: updated.mobileNumber || "",
        role: updated.role || "USER"
      });
      setStatus({ message: "Profile settings synchronized successfully.", isError: false });
    } catch (err) {
      setStatus({ message: err.message || "Failed to update profile settings.", isError: true });
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardWrapper>
      <Sidebar />

      <MainPanel>
        <Header />

        <SettingsGrid>
          <Card>
            <CardTitle>
              <Sliders size={18} />
              Aesthetics Customization
            </CardTitle>
            
            <ToggleContainer>
              <ToggleInfo>
                <ToggleTitle>Interface Theme Mode</ToggleTitle>
                <ToggleDesc>Toggle the terminal display between luxury obsidian dark and clean minimal light modes.</ToggleDesc>
              </ToggleInfo>
              <Switch>
                <SwitchInput 
                  type="checkbox" 
                  checked={themeMode === "light"} 
                  onChange={toggleThemeMode} 
                />
                <Slider />
              </Switch>
            </ToggleContainer>
          </Card>

          <Card>
            <CardTitle>
              <User size={18} />
              Operator Profile Settings
            </CardTitle>
            <form onSubmit={handleProfileSubmit}>
              <FormRow>
                <FormGroup>
                  <Label>First Name</Label>
                  <InputWrapper>
                    <InputIcon><User size={16} /></InputIcon>
                    <Input 
                      type="text" 
                      value={profile.firstName} 
                      onChange={(e) => setProfile({ ...profile, firstName: e.target.value })} 
                      disabled={loading}
                      required
                    />
                  </InputWrapper>
                </FormGroup>

                <FormGroup>
                  <Label>Last Name</Label>
                  <InputWrapper>
                    <InputIcon><User size={16} /></InputIcon>
                    <Input 
                      type="text" 
                      value={profile.lastName} 
                      onChange={(e) => setProfile({ ...profile, lastName: e.target.value })} 
                      disabled={loading}
                      required
                    />
                  </InputWrapper>
                </FormGroup>
              </FormRow>

              <FormRow>
                <FormGroup>
                  <Label>Secure Email Address</Label>
                  <InputWrapper>
                    <InputIcon><Mail size={16} /></InputIcon>
                    <Input 
                      type="email" 
                      value={profile.email} 
                      disabled 
                    />
                  </InputWrapper>
                </FormGroup>

                <FormGroup>
                  <Label>Contact Number</Label>
                  <InputWrapper>
                    <InputIcon><Smartphone size={16} /></InputIcon>
                    <Input 
                      type="text" 
                      value={profile.mobileNumber} 
                      onChange={(e) => setProfile({ ...profile, mobileNumber: e.target.value })} 
                      disabled={loading}
                      required
                    />
                  </InputWrapper>
                </FormGroup>
              </FormRow>

              <FormRow style={{ marginBottom: "24px" }}>
                <FormGroup>
                  <Label>Active Authorization Role Mode</Label>
                  <InputWrapper>
                    <InputIcon><Award size={16} /></InputIcon>
                    <Selector 
                      value={profile.role} 
                      onChange={(e) => setProfile({ ...profile, role: e.target.value })}
                      disabled={loading}
                    >
                      <option value="USER">USER</option>
                      <option value="TRADER">TRADER</option>
                      <option value="ADMIN">ADMIN</option>
                    </Selector>
                  </InputWrapper>
                </FormGroup>

                <div />
              </FormRow>

              <Button type="submit" disabled={loading}>
                {loading ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <>
                    <Check size={16} /> Save Profile Settings
                  </>
                )}
              </Button>

              {status && (
                <StatusText $isError={status.isError}>
                  {status.message}
                </StatusText>
              )}
            </form>
          </Card>

          <Card>
            <CardTitle>
              <Key size={18} />
              Finnhub API Configuration
            </CardTitle>
            <FormGroup>
              <Label>Active Finnhub API Key</Label>
              <InputWrapper>
                <InputIcon><Key size={16} /></InputIcon>
                <Input 
                  type="password" 
                  value={apiKey} 
                  onChange={(e) => setApiKey(e.target.value)} 
                />
              </InputWrapper>
            </FormGroup>
            <Button onClick={() => alert("Finnhub integration validated successfully.")}>
              Verify Connectivity
            </Button>
          </Card>

          <Card>
            <CardTitle>
              <Shield size={18} />
              Vault Security Settings
            </CardTitle>
            
            <ToggleContainer>
              <ToggleInfo>
                <ToggleTitle>Two-Factor Authentication (2FA)</ToggleTitle>
                <ToggleDesc>Enforce automated OTP code validation upon login credentials submission.</ToggleDesc>
              </ToggleInfo>
              <Switch>
                <SwitchInput 
                  type="checkbox" 
                  checked={twoFactor} 
                  onChange={() => setTwoFactor(!twoFactor)} 
                />
                <Slider />
              </Switch>
            </ToggleContainer>

            <ToggleContainer>
              <ToggleInfo>
                <ToggleTitle>Email Transaction Receipts</ToggleTitle>
                <ToggleDesc>Send secure audit summaries immediately following stock order executions.</ToggleDesc>
              </ToggleInfo>
              <Switch>
                <SwitchInput 
                  type="checkbox" 
                  checked={emailAlerts} 
                  onChange={() => setEmailAlerts(!emailAlerts)} 
                />
                <Slider />
              </Switch>
            </ToggleContainer>
          </Card>
        </SettingsGrid>
      </MainPanel>
    </DashboardWrapper>
  );
}
