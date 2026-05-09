<template>
	<LegalPageShell title="Privacy Policy">
		<div>
			<p><strong>PRIVACY POLICY</strong></p>
			<p>MixU AI ("MixU," "we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, store, disclose, and protect personal information when you use our website, web application, AI chat, image generation, video generation, asset management, payment, and related services (collectively, the "Service").</p>
			<p>By accessing or using the Service, you acknowledge that you have read and understood this Privacy Policy. Where required by applicable law, we will obtain your consent before collecting or processing personal data.</p>
		</div>

		<div>
			<h2 class="mb-2 text-lg font-bold text-[var(--text-primary)]">Operator Information</h2>
			<p>This Privacy Policy is provided by {{ companyOperatorName }}, the operator of the Service.</p>
			<p><strong>Registered Address:</strong> {{ companyInfo.registeredAddress }}</p>
			<p><strong>Company Registration No.:</strong> {{ companyInfo.registrationNumber }}</p>
		</div>

		<div>
			<h2 class="mb-2 text-lg font-bold text-[var(--text-primary)]">Quick Links</h2>
			<ul class="list-disc space-y-1 pl-5">
				<li>Definitions and Key Terms</li>
				<li>Categories of Personal Data and Processing</li>
				<li>How We Use Your Information</li>
				<li>How We Disclose Your Information</li>
				<li>Delete Account Policy</li>
				<li>Rights of Data Subjects</li>
			</ul>
		</div>

		<div>
			<h2 class="mb-2 text-lg font-bold text-[var(--text-primary)]">Definitions and Key Terms</h2>
			<ul class="list-disc space-y-2 pl-5">
				<li><strong>Cookie:</strong> A small piece of data stored on your device by your browser to remember preferences, support login sessions, perform analytics, and improve user experience.</li>
				<li><strong>Company:</strong> Refers to {{ companyOperatorName }}, the operator of MixU AI, also referred to as "we," "us," or "our."</li>
				<li><strong>Customer:</strong> An individual or organization that creates an account, subscribes, purchases credits, or otherwise uses the Service.</li>
				<li><strong>Device:</strong> Any internet-connected device such as a computer, phone, tablet, or other device used to access the Service.</li>
				<li><strong>Personal Data:</strong> Information that identifies or can reasonably identify a natural person, such as an email address, account identifier, IP address, or social login profile information.</li>
				<li><strong>Service:</strong> MixU's AI chat, model access, image generation, video generation, project and asset management, billing, and related website or application features.</li>
				<li><strong>Third-Party Service Providers:</strong> External providers that help us operate, secure, analyze, bill, host, or improve the Service, including cloud providers, payment processors, model providers, analytics tools, and customer support tools.</li>
				<li><strong>You:</strong> The individual who accesses or uses the Service, personally or on behalf of an organization.</li>
			</ul>
		</div>

		<div>
			<h2 class="mb-2 text-lg font-bold text-[var(--text-primary)]">Categories of Personal Data and Processing</h2>
			<p>We process personal data only where we have an appropriate legal basis, such as performance of a contract, compliance with legal obligations, your consent, or our legitimate interests.</p>
		</div>

		<div>
			<h3 class="mb-2 font-bold text-[var(--text-primary)]">1. Personal and Contact Information</h3>
			<p><strong>Data Types:</strong> Social login account name, email address, avatar, account ID, nickname, and authentication identifiers.</p>
			<p><strong>Purpose:</strong> To create and manage your account, authenticate you, provide support, communicate service notices, and respond to inquiries.</p>
			<p><strong>Legal Basis:</strong> Performance of a contract and legitimate interest.</p>
		</div>

		<div>
			<h3 class="mb-2 font-bold text-[var(--text-primary)]">2. Technical and Security Data</h3>
			<p><strong>Data Types:</strong> IP address, browser type and version, device type, operating system, access times, referring URLs, diagnostic logs, and configuration data.</p>
			<p><strong>Purpose:</strong> To operate the Service, secure accounts, prevent abuse, debug issues, monitor reliability, and detect fraudulent or unlawful activity.</p>
			<p><strong>Legal Basis:</strong> Legitimate interest and legal obligation where applicable.</p>
		</div>

		<div>
			<h3 class="mb-2 font-bold text-[var(--text-primary)]">3. Usage, Prompt, and Generation Data</h3>
			<p><strong>Data Types:</strong> Prompts, chat messages, uploaded files, generated images or videos, model selections, task history, project metadata, asset metadata, usage logs, and error reports.</p>
			<p><strong>Purpose:</strong> To provide AI responses and generation outputs, maintain conversation history, manage projects and assets, improve service quality, troubleshoot failures, and enforce safety policies.</p>
			<p><strong>Legal Basis:</strong> Performance of a contract, legitimate interest, and consent where required.</p>
		</div>

		<div>
			<h3 class="mb-2 font-bold text-[var(--text-primary)]">4. Transaction and Billing Information</h3>
			<p><strong>Data Types:</strong> Purchase history, subscription status, order details, credit usage, payment status, invoice records, and billing-related identifiers.</p>
			<p><strong>Purpose:</strong> To process purchases, provide subscriptions or credits, prevent payment abuse, maintain accounting records, and resolve billing disputes.</p>
			<p><strong>Legal Basis:</strong> Performance of a contract and legal obligation.</p>
		</div>

		<div>
			<h3 class="mb-2 font-bold text-[var(--text-primary)]">5. Marketing and Analytics Data</h3>
			<p><strong>Data Types:</strong> Cookies, analytics events, user preferences, campaign attribution, interaction with product messages, and marketing email engagement where applicable.</p>
			<p><strong>Purpose:</strong> To understand product usage, improve onboarding, measure campaigns, personalize product experiences, and send permitted service or marketing communications.</p>
			<p><strong>Legal Basis:</strong> Legitimate interest and consent where required for non-essential cookies or direct marketing.</p>
		</div>

		<div>
			<h2 class="mb-2 text-lg font-bold text-[var(--text-primary)]">How We Use Your Information</h2>
			<ul class="list-disc space-y-2 pl-5">
				<li>Provide AI chat, search, image generation, video generation, and related model-powered services.</li>
				<li>Manage your account, login status, projects, conversations, files, and generated assets.</li>
				<li>Provide customer support and technical troubleshooting.</li>
				<li>Process purchases, subscriptions, credits, and billing records.</li>
				<li>Improve, test, debug, and secure the Service.</li>
				<li>Detect fraud, abuse, policy violations, and unauthorized activity.</li>
				<li>Communicate with you about your account, service changes, policy updates, and support requests.</li>
				<li>Comply with legal obligations and enforce our agreements.</li>
			</ul>
		</div>

		<div>
			<h2 class="mb-2 text-lg font-bold text-[var(--text-primary)]">How We Disclose Your Information</h2>
			<p>We may disclose personal information to third parties for business, operational, legal, and safety purposes, including:</p>
			<ul class="list-disc space-y-2 pl-5">
				<li><strong>AI Model Providers:</strong> We may send prompts, inputs, uploaded media, and generation parameters to model providers so they can return AI outputs.</li>
				<li><strong>Cloud and Infrastructure Providers:</strong> We use hosting, storage, content delivery, database, and security providers to operate the Service.</li>
				<li><strong>Payment Processors:</strong> Payments are processed by third-party payment providers. We do not store full credit card numbers.</li>
				<li><strong>Analytics and Measurement Providers:</strong> We may use analytics tools to understand performance, diagnose issues, and improve the Service.</li>
				<li><strong>Customer Support Providers:</strong> We may use support tools to respond to your requests.</li>
				<li><strong>Legal and Safety Disclosures:</strong> We may disclose information if required by law, legal process, public authorities, or to protect rights, safety, property, and platform integrity.</li>
				<li><strong>Business Transfers:</strong> If MixU is involved in a merger, acquisition, financing, restructuring, or sale of assets, information may be transferred as part of that transaction.</li>
			</ul>
		</div>

		<div>
			<h2 class="mb-2 text-lg font-bold text-[var(--text-primary)]">Retention of Personal Information</h2>
			<p>We retain personal information for as long as needed to provide the Service, maintain your account, resolve disputes, enforce agreements, comply with legal obligations, maintain security logs, and support legitimate business purposes. Some data may remain in backups for a limited period before deletion.</p>
		</div>

		<div>
			<h2 class="mb-2 text-lg font-bold text-[var(--text-primary)]">Security Measures</h2>
			<p>We use reasonable technical and organizational measures to protect personal information, including access controls, logging, encryption in transit where appropriate, infrastructure security, backup controls, and internal access restrictions. No internet-based service can be guaranteed to be completely secure.</p>
		</div>

		<div>
			<h2 class="mb-2 text-lg font-bold text-[var(--text-primary)]">Cookies</h2>
			<p>MixU may use cookies and similar technologies to maintain login sessions, remember preferences, improve performance, understand usage, and support analytics. You can control cookies through your browser settings. Disabling cookies may affect certain features of the Service.</p>
		</div>

		<div>
			<h2 class="mb-2 text-lg font-bold text-[var(--text-primary)]">Payment Details</h2>
			<p>We do not store full credit card information. Payment information is processed by third-party payment providers. If you need to manage or delete payment method details, please contact the relevant payment provider or contact us for assistance.</p>
		</div>

		<div>
			<h2 class="mb-2 text-lg font-bold text-[var(--text-primary)]">Children's Privacy</h2>
			<p>The Service is not directed to children under 13, and we do not knowingly collect personal information from children under 13. If you believe a child has provided personal information to us, please contact us so we can take appropriate action.</p>
		</div>

		<div>
			<h2 class="mb-2 text-lg font-bold text-[var(--text-primary)]">AI Services Disclaimer</h2>
			<p>MixU may use third-party AI models and APIs to provide chat, image generation, video generation, and other AI capabilities. MixU is not affiliated with or endorsed by those providers unless explicitly stated. Please do not submit sensitive, confidential, unlawful, or unauthorized third-party content to the Service.</p>
		</div>

		<div>
			<h2 class="mb-2 text-lg font-bold text-[var(--text-primary)]">Delete Account Policy</h2>
			<p>You may request deletion of your account and associated personal data through account settings, in-product support, or our official contact channel. Account deletion may result in loss of access to your conversations, projects, files, generated assets, credits, and subscription benefits.</p>
			<ul class="list-disc space-y-2 pl-5">
				<li><strong>Immediate Effect:</strong> After confirmation, your account may be disabled or deleted and may not be recoverable.</li>
				<li><strong>Backup Retention:</strong> Some information may remain in backups for a limited period.</li>
				<li><strong>Legal Exceptions:</strong> We may retain information where required for legal, accounting, fraud prevention, dispute resolution, or compliance purposes.</li>
				<li><strong>No Refunds:</strong> Account deletion does not create a refund right for used or unused digital services, credits, or subscriptions unless required by law.</li>
			</ul>
		</div>

		<div>
			<h2 class="mb-2 text-lg font-bold text-[var(--text-primary)]">Refund Policy</h2>
			<p>MixU provides digital AI services, credits, subscriptions, and instantly delivered model usage. Except where required by applicable law, all purchases are final and non-refundable.</p>
			<ul class="list-disc space-y-2 pl-5">
				<li><strong>Scope:</strong> This policy applies to credit purchases, memberships, subscriptions, feature packages, model usage, image generation, video generation, and other digital services provided by MixU.</li>
				<li><strong>Confirm Before Purchase:</strong> Please confirm the service details, pricing, account, regional availability, model capabilities, and your usage needs before payment. A successful payment means you confirm the purchase and accept this Refund Policy.</li>
				<li><strong>Technical Exceptions:</strong> If duplicate charges occur, or if payment succeeds but the purchased credits or subscription benefits are not delivered, you may submit order information for review. If verified, we will prioritize restoring or issuing the missing benefits.</li>
				<li><strong>Service Interruptions:</strong> Model providers, networks, payment channels, or third-party services may be temporarily unavailable. These interruptions generally do not qualify for a refund, but we will make reasonable efforts to restore service.</li>
				<li><strong>Account Deletion:</strong> Deleting your account does not create a refund right for used or unused digital services, credits, or subscriptions unless required by law.</li>
			</ul>
		</div>

		<div>
			<h2 class="mb-2 text-lg font-bold text-[var(--text-primary)]">GDPR and Data Subject Rights</h2>
			<p>Depending on your location and applicable law, you may have rights to access, correct, delete, restrict, object to processing, withdraw consent, or receive a portable copy of your personal data. To exercise these rights, please contact us with details of your request.</p>
		</div>

		<div>
			<h2 class="mb-2 text-lg font-bold text-[var(--text-primary)]">California Privacy Rights</h2>
			<p>If applicable, California residents may have rights to know, access, correct, delete, and opt out of certain sharing of personal information. We do not sell personal information in the traditional sense, but may share limited analytics or marketing data as described in this Policy.</p>
		</div>

		<div>
			<h2 class="mb-2 text-lg font-bold text-[var(--text-primary)]">Changes to This Privacy Policy</h2>
			<p>We may update this Privacy Policy from time to time. Updated versions will be posted on this page. If you continue using the Service after an update, you acknowledge the updated Privacy Policy.</p>
		</div>

		<div>
			<h2 class="mb-2 text-lg font-bold text-[var(--text-primary)]">Contact Us</h2>
			<p>If you have questions about this Privacy Policy or your personal data, please contact us through {{ companyInfo.supportChannel }} or another official support entry made available in the Service.</p>
			<p><strong>Operator:</strong> {{ companyOperatorName }}</p>
			<p><strong>Registered Address:</strong> {{ companyInfo.registeredAddress }}</p>
			<p><strong>Company Registration No.:</strong> {{ companyInfo.registrationNumber }}</p>
			<p>Updated at 2026-05-09</p>
		</div>
	</LegalPageShell>
</template>

<script setup lang="ts">
import { COMPANY_INFO, COMPANY_OPERATOR_NAME } from '@/utils/company'

definePageMeta({
	layout: 'legal',
})

const companyInfo = COMPANY_INFO
const companyOperatorName = COMPANY_OPERATOR_NAME
</script>
