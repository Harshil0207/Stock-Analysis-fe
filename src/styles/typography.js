import { css } from "styled-components";

const headingFont = css`
  font-family: ${({ theme }) => theme.fonts.heading};
`;

const bodyFont = css`
  font-family: ${({ theme }) => theme.fonts.body};
`;

export const fs120 = css`
  ${headingFont}
  font-size: 110px;
  line-height: 1.05em;
  font-weight: 700;
  letter-spacing: -0.03em;
  @media (max-width: 991px) {
    font-size: 80px;
  }
  @media (max-width: 767px) {
    font-size: 55px;
  }
`;

export const fs60 = css`
  ${headingFont}
  font-size: 60px;
  line-height: 1.15em;
  font-weight: 600;
  letter-spacing: -0.02em;
  @media (max-width: 991px) {
    font-size: 45px;
  }
  @media (max-width: 767px) {
    font-size: 32px;
  }
`;

export const fs36 = css`
  ${headingFont}
  font-size: 36px;
  line-height: 1.25em;
  font-weight: 500;
  @media (max-width: 991px) {
    font-size: 28px;
  }
`;

export const fs20 = css`
  ${bodyFont}
  font-size: 20px;
  line-height: 1.5em;
  font-weight: 400;
  @media (max-width: 767px) {
    font-size: 18px;
  }
`;

export const fs16 = css`
  ${bodyFont}
  font-size: 16px;
  line-height: 1.6em;
  font-weight: 400;
`;

export const fs14 = css`
  ${bodyFont}
  font-size: 14px;
  line-height: 1.5em;
  font-weight: 400;
`;

export const sectionSubtitle = css`
  ${bodyFont}
  color: ${({ theme }) => theme.gold};
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.25em;
  text-transform: uppercase;
  margin-bottom: 12px;
`;
