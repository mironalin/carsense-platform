import {
  Body,
  Button,
  Container,
  Font,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";
import * as React from "react";

type PasswordResetProps = {
  userName: string;
  resetUrl: string;
};

function PasswordReset(props: PasswordResetProps) {
  const { userName, resetUrl } = props;

  return (
    <Html lang="en" dir="ltr">
      <Head>
        <Font
          fontFamily="Inter"
          fallbackFontFamily="Helvetica"
          webFont={{
            url: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap",
            format: "woff2",
          }}
        />
      </Head>
      <Tailwind>
        <Body className="bg-gray-50 font-['Inter',Helvetica,Arial,sans-serif] py-[32px] px-[16px]">
          {/* Main Container */}
          <Container className="bg-white rounded-[12px] shadow-sm border border-gray-200 p-0 max-w-[600px] mx-auto">

            {/* Header Section */}
            <Section className="bg-red-600 px-[32px] py-[40px] text-center rounded-t-[12px]">
              <Heading className="text-[32px] font-bold text-white mb-[8px] mt-0 leading-[36px]">
                Reset Your Password
              </Heading>
              <Text className="text-[18px] text-white opacity-90 m-0 leading-[24px]">
                Secure your CarSense account
              </Text>
            </Section>

            {/* Main Content */}
            <Section className="px-[32px] py-[32px]">
              {/* Greeting */}
              <Text className="text-[20px] font-semibold text-gray-900 mb-[20px] mt-0 leading-[28px]">
                Hi
                {" "}
                {userName}
                ! 🔐
              </Text>

              <Text className="text-[16px] text-gray-700 mb-[28px] mt-0 leading-[24px]">
                We received a request to reset your CarSense account password. To create a new password and regain
                access to your vehicle monitoring dashboard, click the button below.
              </Text>

              {/* CTA Button */}
              <Section className="text-center mb-[32px]">
                <Button
                  href={resetUrl}
                  className="bg-red-600 text-white px-[48px] py-[16px] rounded-[8px] text-[16px] font-semibold no-underline inline-block"
                  style={{
                    backgroundColor: "#dc2626",
                    color: "#ffffff",
                    padding: "16px 48px",
                    borderRadius: "8px",
                    textDecoration: "none",
                    fontSize: "16px",
                    fontWeight: "600",
                    display: "inline-block",
                  }}
                >
                  Reset Password
                </Button>
              </Section>

              {/* Security Information */}
              <Section className="mb-[32px]">
                <Text className="text-[18px] font-semibold text-gray-900 mb-[16px] mt-0 leading-[24px]">
                  Important security information
                </Text>
                <Text className="text-[15px] text-gray-700 m-0 leading-[22px]">
                  For your account security:
                  <br />
                  <br />
                  ⏰
                  {" "}
                  <strong>This link expires in 1 hour</strong>
                  {" "}
                  - Use it soon to reset your password
                  <br />
                  🔒
                  {" "}
                  <strong>Didn't request this?</strong>
                  {" "}
                  - You can safely ignore this email
                  <br />
                  🚗
                  {" "}
                  <strong>Account protected</strong>
                  {" "}
                  - Your vehicle data remains secure
                  <br />
                  💡
                  {" "}
                  <strong>Choose a strong password</strong>
                  {" "}
                  - Use a mix of letters, numbers, and symbols
                </Text>
              </Section>

              <Hr className="border-gray-300 my-[32px]" />

              {/* Sign Off */}
              <Text className="text-[15px] text-gray-700 m-0 leading-[22px]">
                Stay secure,
                <br />
                <strong>The CarSense Team</strong>
              </Text>
            </Section>

            {/* Footer */}
            <Section className="bg-gray-100 px-[32px] py-[24px] text-center border-t border-gray-200 rounded-b-[12px]">
              <Text className="text-[13px] text-gray-600 m-0 leading-[18px] mb-[8px]">
                <strong>CarSense Platform</strong>
                <br />
                Vehicle Health Monitoring & Diagnostics
              </Text>

              <Text className="text-[12px] text-gray-500 m-0 leading-[16px]">
                Questions? Email us at
                {" "}
                <Link href="mailto:support@carsense.alinmiron.live" className="text-red-600 underline">
                  support@carsense.alinmiron.live
                </Link>
                <br />
                © 2025 CarSense. All rights reserved.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}

export { PasswordReset };
export default PasswordReset;
