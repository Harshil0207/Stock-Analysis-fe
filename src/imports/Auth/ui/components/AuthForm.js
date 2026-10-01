"use client";

import React, { useEffect } from "react";
import styled, { keyframes } from "styled-components";
import { 
  Mail, 
  User, 
  Phone, 
  ArrowRight, 
  ShieldCheck, 
  Coins, 
  Loader2, 
  CheckCircle2,
  ChevronLeft
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth.js";
import { useRouter } from "next/navigation";

export default function AuthForm({ initialMode = "login" }) {
  const router = useRouter();
  const {
    mode,
    step,
    regForm,
    loginEmail,
    otpArray,
    resendCooldown,
    loading,
    error,
    success,
    userProfile,
    setStep,
    setLoginEmail,
    handleRegChange,
    handleToggleMode,
    handleFormSubmit,
    handleOtpChange,
    handleOtpKeyDown,
    handleOtpSubmit,
    handleResend,
  } = useAuth(initialMode);

  useEffect(() => {
    if (step === "success") {
      router.push("/dashboard");
    }
  }, [step, router]);

  return (
    <LuxuryGlassCard>
      {step === "form" && (
        <>
          <HeaderGroup>
            <CardTitle>
              {mode === "register" ? "Create Account" : "Access Vault"}
            </CardTitle>
            <CardDesc>
              {mode === "register" 
                ? "Establish your signature trading terminal profile." 
                : "Provide credentials to initiate transaction vault access."}
            </CardDesc>
          </HeaderGroup>

          <Form onSubmit={handleFormSubmit}>
            {error && <ErrorMessageBox>{error}</ErrorMessageBox>}
            {success && <SuccessMessageBox>{success}</SuccessMessageBox>}

            {mode === "register" ? (
              <>
                <Row>
                  <InputGroup>
                    <Label>First Name</Label>
                    <InputWrapper>
                      <IconBox><User size={16} /></IconBox>
                      <InputField 
                        type="text" 
                        name="firstName"
                        placeholder="First Name" 
                        value={regForm.firstName}
                        onChange={handleRegChange}
                        required
                      />
                    </InputWrapper>
                  </InputGroup>

                  <InputGroup>
                    <Label>Last Name</Label>
                    <InputWrapper>
                      <IconBox><User size={16} /></IconBox>
                      <InputField 
                        type="text" 
                        name="lastName"
                        placeholder="Last Name" 
                        value={regForm.lastName}
                        onChange={handleRegChange}
                        required
                      />
                    </InputWrapper>
                  </InputGroup>
                </Row>

                <InputGroup>
                  <Label>Corporate Email</Label>
                  <InputWrapper>
                    <IconBox><Mail size={16} /></IconBox>
                    <InputField 
                      type="email" 
                      name="email"
                      placeholder="user123@gmail.com" 
                      value={regForm.email}
                      onChange={handleRegChange}
                      required
                    />
                  </InputWrapper>
                </InputGroup>

                <InputGroup>
                  <Label>Mobile Number</Label>
                  <InputWrapper>
                    <IconBox><Phone size={16} /></IconBox>
                    <InputField 
                      type="tel" 
                      name="mobileNumber"
                      placeholder="9876543210" 
                      value={regForm.mobileNumber}
                      onChange={handleRegChange}
                      required
                    />
                  </InputWrapper>
                </InputGroup>
              </>
            ) : (
              <InputGroup>
                <Label>Authorized Email</Label>
                <InputWrapper>
                  <IconBox><Mail size={16} /></IconBox>
                  <InputField 
                    type="email" 
                    name="email"
                    placeholder="user123@gmail.com" 
                    value={loginEmail}
                    onChange={(e) => { setLoginEmail(e.target.value); }}
                    required
                  />
                </InputWrapper>
              </InputGroup>
            )}

            <SubmitButton type="submit" disabled={loading}>
              {loading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <>
                  {mode === "register" ? "Generate Vault Keys" : "Request Secure Passcode"}
                  <ArrowRight size={16} />
                </>
              )}
            </SubmitButton>
          </Form>

          <ToggleContainer>
            <ToggleText>
              {mode === "register" ? "Already registered?" : "Need terminal access?"}
            </ToggleText>
            <ToggleBtn onClick={handleToggleMode}>
              {mode === "register" ? "Access Vault" : "Create Account"}
            </ToggleBtn>
          </ToggleContainer>
        </>
      )}

      {step === "otp" && (
        <>
          <ArrowBackButton onClick={() => setStep("form")}>
            <ChevronLeft size={14} /> Back to credentials
          </ArrowBackButton>

          <HeaderGroup>
            <CardTitle>Verify Passcode</CardTitle>
            <CardDesc>
              We transmitted an encrypted 6-digit session key to{" "}
              <strong>{mode === "register" ? regForm.email : loginEmail}</strong>.
            </CardDesc>
          </HeaderGroup>

          <Form onSubmit={handleOtpSubmit}>
            {error && <ErrorMessageBox>{error}</ErrorMessageBox>}
            {success && <SuccessMessageBox>{success}</SuccessMessageBox>}

            <InputGroup>
              <Label>One-Time Vault Key</Label>
              <OtpContainerGrid>
                {otpArray.map((digit, idx) => (
                  <OtpDigitField
                    key={idx}
                    type="text"
                    maxLength="1"
                    value={digit}
                    onChange={(e) => handleOtpChange(e.target, idx)}
                    onKeyDown={(e) => handleOtpKeyDown(e, idx)}
                    onFocus={(e) => e.target.select()}
                  />
                ))}
              </OtpContainerGrid>
            </InputGroup>

            <SubmitButton type="submit" disabled={loading}>
              {loading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <>
                  Decrypt &amp; Access Terminal
                  <ShieldCheck size={18} />
                </>
              )}
            </SubmitButton>
          </Form>

          <ResendControlRow>
            <ResendText>
              {resendCooldown > 0 
                ? `Resend available in ${resendCooldown}s` 
                : "Did not receive code?"}
            </ResendText>
            <ResendBtn 
              onClick={handleResend} 
              disabled={loading || resendCooldown > 0}
            >
              Resend Code
            </ResendBtn>
          </ResendControlRow>
        </>
      )}

    </LuxuryGlassCard>
  );
}

const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-12px); }
  100% { transform: translateY(0px); }
`;

const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

const fadeInScale = keyframes`
  from { opacity: 0; transform: scale(0.96) translateY(10px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
`;

const pulseBorder = keyframes`
  0% { border-color: rgba(212, 175, 55, 0.2); }
  50% { border-color: rgba(212, 175, 55, 0.45); }
  100% { border-color: rgba(212, 175, 55, 0.2); }
`;

const LuxuryGlassCard = styled.div`
  width: 100%;
  max-width: 460px;
  background: rgba(10, 10, 12, 0.75);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 28px;
  padding: 44px;
  backdrop-filter: blur(25px);
  position: relative;
  z-index: 2;
  box-shadow: 
    0 30px 60px rgba(0, 0, 0, 0.5),
    inset 0 1px 0 rgba(255, 255, 255, 0.08);
  animation: 
    ${fadeInScale} 0.55s cubic-bezier(0.16, 1, 0.3, 1) forwards,
    ${pulseBorder} 8s infinite alternate ease-in-out;

  @media (max-width: 480px) {
    padding: 30px 20px;
  }
`;

const HeaderGroup = styled.header`
  display: flex;
  flex-direction: column;
  margin-bottom: 30px;
`;

const CardTitle = styled.h3`
  font-family: var(--font-syne), sans-serif;
  font-size: 30px;
  font-weight: 700;
  color: #fff;
  letter-spacing: -0.01em;
  margin-bottom: 6px;
`;

const CardDesc = styled.p`
  font-size: 14px;
  color: #8c8c9a;
  line-height: 1.5;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 22px;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #d4af37;
`;

const InputWrapper = styled.div`
  display: flex;
  align-items: center;
  position: relative;
`;

const IconBox = styled.div`
  position: absolute;
  left: 16px;
  color: #7c7c8a;
  display: flex;
  align-items: center;
  pointer-events: none;
`;

const InputField = styled.input`
  width: 100%;
  padding: 15px 16px 15px 48px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  color: #ffffff;
  font-size: 15px;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);

  &:focus {
    border-color: #d4af37;
    background: rgba(212, 175, 55, 0.02);
    box-shadow: 
      0 0 0 1px rgba(212, 175, 55, 0.2),
      0 4px 20px rgba(0, 0, 0, 0.2);
  }

  &::placeholder {
    color: #4a4a58;
  }
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
`;

const ErrorMessageBox = styled.div`
  background: rgba(244, 63, 94, 0.06);
  border: 1px solid rgba(244, 63, 94, 0.15);
  color: #f43f5e;
  padding: 12px 16px;
  border-radius: 10px;
  font-size: 13px;
  line-height: 1.4;
`;

const SuccessMessageBox = styled.div`
  background: rgba(16, 185, 129, 0.06);
  border: 1px solid rgba(16, 185, 129, 0.15);
  color: #10b981;
  padding: 12px 16px;
  border-radius: 10px;
  font-size: 13px;
  line-height: 1.4;
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 16px;
  background: linear-gradient(90deg, #d4af37 0%, #aa8453 100%);
  border: none;
  border-radius: 12px;
  color: #000;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  position: relative;
  overflow: hidden;
  box-shadow: 0 6px 20px rgba(212, 175, 55, 0.15);
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);

  &::before {
    content: '';
    position: absolute;
    top: 0; right: 0; bottom: 0; left: 0;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.25), transparent);
    background-size: 200% 100%;
    animation: ${shimmer} 3s infinite;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 25px rgba(212, 175, 55, 0.25);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
  }
`;

const ToggleContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  margin-top: 24px;
  font-size: 13px;
`;

const ToggleText = styled.span`
  color: #8c8c9a;
`;

const ToggleBtn = styled.button`
  background: none;
  border: none;
  color: #d4af37;
  font-weight: 600;
  cursor: pointer;
  padding: 0;
  transition: all 0.2s ease;
  
  &:hover {
    color: #fff;
    text-decoration: underline;
  }
`;

const ArrowBackButton = styled.button`
  background: none;
  border: none;
  color: #8c8c9a;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 24px;
  padding: 0;
  transition: color 0.2s ease;

  &:hover {
    color: #fff;
  }
`;

const OtpContainerGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 8px;
  margin: 16px 0;
`;

const OtpDigitField = styled.input`
  width: 100%;
  min-width: 0;
  box-sizing: border-box;
  height: 52px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 10px;
  color: #fff;
  font-size: 20px;
  font-weight: 700;
  text-align: center;
  transition: all 0.2s ease;

  &:focus {
    border-color: #d4af37;
    background: rgba(212, 175, 55, 0.01);
    box-shadow: 0 0 0 1px rgba(212, 175, 55, 0.2);
  }
`;

const ResendControlRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 13px;
  margin-top: 8px;
`;

const ResendText = styled.span`
  color: #8c8c9a;
`;

const ResendBtn = styled.button`
  background: none;
  border: none;
  color: #d4af37;
  font-weight: 600;
  cursor: pointer;
  padding: 0;

  &:disabled {
    color: #4a4a58;
    cursor: not-allowed;
  }
`;

const SuccessView = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

const SuccessPulseRing = styled.div`
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: rgba(16, 185, 129, 0.06);
  border: 1px solid rgba(16, 185, 129, 0.25);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #10b981;
  margin-bottom: 24px;
  animation: ${float} 4s ease-in-out infinite;
`;
