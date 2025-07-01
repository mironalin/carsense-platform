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

type VerifyEmailProps = {
  username: string;
  verifyUrl: string;
};

function VerifyEmail(props: VerifyEmailProps) {
  const { username, verifyUrl } = props;
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
            <Section className="bg-blue-600 px-[32px] py-[40px] text-center rounded-t-[12px]">
              <Heading className="text-[32px] font-bold text-white mb-[8px] mt-0 leading-[36px]">
                Welcome to CarSense!
              </Heading>
              <Text className="text-[18px] text-white opacity-90 m-0 leading-[24px]">
                Your vehicle health monitoring platform
              </Text>
            </Section>

            {/* Main Content */}
            <Section className="px-[32px] py-[32px]">
              {/* Greeting */}
              <Text className="text-[20px] font-semibold text-gray-900 mb-[20px] mt-0 leading-[28px]">
                Hi
                {" "}
                {username}
                ! 👋
              </Text>

              <Text className="text-[16px] text-gray-700 mb-[28px] mt-0 leading-[24px]">
                Thanks for joining CarSense! To complete your account setup and start monitoring your vehicle's health,
                please verify your email address by clicking the button below.
              </Text>

              {/* CTA Button */}
              <Section className="text-center mb-[32px]">
                <Button
                  href={verifyUrl}
                  className="bg-blue-600 text-white px-[48px] py-[16px] rounded-[8px] text-[16px] font-semibold no-underline inline-block"
                  style={{
                    backgroundColor: "#2563eb",
                    color: "#ffffff",
                    padding: "16px 48px",
                    borderRadius: "8px",
                    textDecoration: "none",
                    fontSize: "16px",
                    fontWeight: "600",
                    display: "inline-block",
                  }}
                >
                  Verify Email Address
                </Button>
              </Section>

              {/* What's Next */}
              <Section className="mb-[32px]">
                <Text className="text-[18px] font-semibold text-gray-900 mb-[16px] mt-0 leading-[24px]">
                  What's next?
                </Text>
                <Text className="text-[15px] text-gray-700 m-0 leading-[22px]">
                  After verification, you'll have access to:
                  <br />
                  <br />
                  🚗
                  {" "}
                  <strong>Real-time diagnostics</strong>
                  {" "}
                  - Monitor your vehicle's health instantly
                  <br />
                  📊
                  {" "}
                  <strong>Health dashboard</strong>
                  {" "}
                  - Visual insights into performance metrics
                  <br />
                  🔧
                  {" "}
                  <strong>Maintenance alerts</strong>
                  {" "}
                  - Never miss important service reminders
                  <br />
                  📱
                  {" "}
                  <strong>Mobile notifications</strong>
                  {" "}
                  - Stay informed wherever you are
                  <br />
                  📈
                  {" "}
                  <strong>Performance tracking</strong>
                  {" "}
                  - Historical data and trends
                </Text>
              </Section>

              <Hr className="border-gray-300 my-[32px]" />

              {/* Sign Off */}
              <Text className="text-[15px] text-gray-700 m-0 leading-[22px]">
                Welcome aboard!
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
                <Link href="mailto:support@carsense.alinmiron.live" className="text-blue-600 underline">
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

export default VerifyEmail;
