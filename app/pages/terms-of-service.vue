<template>
	<LegalPageShell title="Terms of Service">
		<div>
			<h2 class="mb-2 text-lg font-bold text-[var(--text-primary)]">Who We Are</h2>
			<p>MixU is an AI aggregation platform that provides a single interface for accessing large language models, image generation models, video generation models, and related AI tools. Users can use MixU for AI chat, content creation, image generation, video generation, AI agents, and asset management.</p>
		</div>

		<div>
			<h2 class="mb-2 text-lg font-bold text-[var(--text-primary)]">Operator Information</h2>
			<p>The Service is operated by {{ companyOperatorName }}.</p>
			<p><strong>Registered Address:</strong> {{ companyInfo.registeredAddress }}</p>
			<p><strong>Company Registration No.:</strong> {{ companyInfo.registrationNumber }}</p>
		</div>

		<div>
			<h2 class="mb-2 text-lg font-bold text-[var(--text-primary)]">Core Service</h2>
			<p>MixU's core value is to make multiple AI models and creative capabilities available through one account and one unified workspace. Model availability, features, generation speed, credit usage, and output quality may vary depending on providers, region, system load, and product configuration.</p>
		</div>

		<div>
			<h2 class="mb-2 text-lg font-bold text-[var(--text-primary)]">Third-Party Model Disclaimer</h2>
			<p>MixU may integrate models and infrastructure from OpenAI, Google, Anthropic, Stability AI, DeepSeek, Meta, or other third-party providers. Unless expressly stated otherwise, MixU is not an official product of these companies and does not represent them. We use relevant capabilities through official APIs, authorized channels, or compliant service agreements.</p>
		</div>

		<div>
			<h2 class="mb-2 text-lg font-bold text-[var(--text-primary)]">Acceptance of Terms</h2>
			<p>By accessing or using MixU, you agree to these Terms of Service, our Privacy Policy including refund terms, and any other rules shown in the product. If you do not agree, you must stop using the service. Continued use of MixU means you accept any updated terms.</p>
		</div>

		<div>
			<h2 class="mb-2 text-lg font-bold text-[var(--text-primary)]">Account Responsibility</h2>
			<p>You are responsible for all login, payment, upload, generation, download, sharing, and other activity under your account. Keep your account credentials secure and do not use your account for unlawful, infringing, abusive, evasive, or harmful activity.</p>
		</div>

		<div>
			<h2 class="mb-2 text-lg font-bold text-[var(--text-primary)]">Restrictions</h2>
			<p>You may not sell, rent, sublicense, resell, scrape, reverse engineer, attack, interfere with, or otherwise commercially exploit MixU without authorization. You may not remove, hide, or modify any copyright, trademark, attribution, or safety notices in the product.</p>
		</div>

		<div>
			<h2 class="mb-2 text-lg font-bold text-[var(--text-primary)]">Prohibited Content</h2>
			<p>You may not use MixU to upload, generate, or distribute unlawful content, infringing content, malware, scams, harassment, hateful content, exploitative sexual content, privacy violations, dangerous instructions, or other content that violates applicable law or platform rules.</p>
		</div>

		<div>
			<h2 class="mb-2 text-lg font-bold text-[var(--text-primary)]">AI Output Limitations</h2>
			<p>AI-generated output may be inaccurate, incomplete, outdated, repetitive, or unsuitable for a particular purpose. You are responsible for reviewing and verifying outputs. Do not rely on MixU as the sole basis for medical, legal, financial, safety, employment, admissions, or other high-stakes decisions.</p>
		</div>

		<div>
			<h2 class="mb-2 text-lg font-bold text-[var(--text-primary)]">User Inputs and Uploaded Files</h2>
			<p>You must ensure that you have the right to upload, process, and use any text, images, videos, files, prompts, or other materials submitted to MixU. Do not upload trade secrets, sensitive personal information, protected health information, or third-party content you are not authorized to process.</p>
		</div>

		<div>
			<h2 class="mb-2 text-lg font-bold text-[var(--text-primary)]">Subscriptions, Credits, and Packages</h2>
			<p>MixU may offer free credits, memberships, subscriptions, credit purchases, feature packages, or other paid services. Different models and tasks may consume different amounts of credits. Package contents, pricing, credit rules, model availability, and feature scope may change over time. The rules shown at the time of purchase apply to that purchase.</p>
		</div>

		<div>
			<h2 class="mb-2 text-lg font-bold text-[var(--text-primary)]">Refunds and Cancellation</h2>
			<p>MixU provides digital AI services, credits, subscriptions, and instantly delivered model usage. Except where required by applicable law, all purchases are final and non-refundable. If duplicate charges occur, or if payment succeeds but benefits are not delivered, you may submit order information for review.</p>
		</div>

		<div>
			<h2 class="mb-2 text-lg font-bold text-[var(--text-primary)]">Service Changes and Interruptions</h2>
			<p>We may modify, suspend, or discontinue features, models, credits, pricing, and usage rules based on model providers, costs, compliance requirements, product planning, or security needs. Third-party service issues, network problems, maintenance, or high system load may cause temporary unavailability.</p>
		</div>

		<div>
			<h2 class="mb-2 text-lg font-bold text-[var(--text-primary)]">Third-Party Services and Links</h2>
			<p>MixU may display or connect to third-party websites, payment channels, model services, storage services, analytics services, or other third-party features. Your use of third-party services is subject to their own terms and policies. MixU does not guarantee third-party content, accuracy, stability, or compliance.</p>
		</div>

		<div>
			<h2 class="mb-2 text-lg font-bold text-[var(--text-primary)]">Intellectual Property</h2>
			<p>MixU's interface, code, brand, design, copy, icons, feature structure, and service materials are protected by intellectual property laws. You may not copy, modify, distribute, sell, or create derivative products without permission. You retain rights to your lawful input content, while granting MixU the permissions needed to process and transmit it to provide the service.</p>
		</div>

		<div>
			<h2 class="mb-2 text-lg font-bold text-[var(--text-primary)]">Feedback</h2>
			<p>If you provide feedback, suggestions, ideas, or improvement requests to MixU, you agree that we may use them for product improvements, feature development, business operations, and service optimization without payment or attribution.</p>
		</div>

		<div>
			<h2 class="mb-2 text-lg font-bold text-[var(--text-primary)]">No Warranties</h2>
			<p>MixU is provided on an "as is" and "as available" basis. We do not guarantee that the service will always be uninterrupted, error-free, fully secure, or suitable for all of your needs. We also do not guarantee that AI outputs will be accurate, unique, lawful, or appropriate for your use case.</p>
		</div>

		<div>
			<h2 class="mb-2 text-lg font-bold text-[var(--text-primary)]">Limitation of Liability</h2>
			<p>To the maximum extent permitted by applicable law, MixU is not liable for indirect, incidental, special, punitive, or consequential damages arising from the use of or inability to use the service, including loss of profits, data loss, business interruption, or third-party claims.</p>
		</div>

		<div>
			<h2 class="mb-2 text-lg font-bold text-[var(--text-primary)]">Indemnification</h2>
			<p>If your inputs, use of the service, unlawful activity, infringement, or violation of these terms causes third-party claims, regulatory action, or platform losses, you agree to reasonably indemnify MixU and its team, partners, and service providers.</p>
		</div>

		<div>
			<h2 class="mb-2 text-lg font-bold text-[var(--text-primary)]">Termination</h2>
			<p>If an account is involved in unlawful activity, infringement, attacks, abuse, limit evasion, malicious resource usage, payment risk, or harm to MixU or third-party rights, we may restrict, suspend, or terminate the relevant service without prior notice.</p>
		</div>

		<div>
			<h2 class="mb-2 text-lg font-bold text-[var(--text-primary)]">Updates to These Terms</h2>
			<p>We may update these Terms of Service from time to time. Updated terms will be posted on this page. If you continue using MixU after an update, you accept the updated terms.</p>
		</div>

		<div>
			<h2 class="mb-2 text-lg font-bold text-[var(--text-primary)]">Contact Us</h2>
			<p>If you have questions about these Terms, your account, orders, content, or product usage, please contact us through {{ companyInfo.supportChannel }} or another official support entry made available in the Service. Include your account, order number, task ID, or screenshots when possible so we can review the issue efficiently.</p>
			<p><strong>Operator:</strong> {{ companyOperatorName }}</p>
			<p><strong>Registered Address:</strong> {{ companyInfo.registeredAddress }}</p>
			<p><strong>Company Registration No.:</strong> {{ companyInfo.registrationNumber }}</p>
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
