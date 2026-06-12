<template>
	<LegalPageShell title="Content Moderation">
		<div>
			<p><strong>CONTENT REVIEW AND MODERATION MECHANISM</strong></p>
			<p>This page explains how MixU AI reviews, restricts, reports, and removes content in order to maintain a lawful and safe service. The Service is operated by {{ companyOperatorName }}.</p>
		</div>

		<div>
			<h2 class="mb-2 text-lg font-bold text-[var(--text-primary)]">Scope</h2>
			<p>This mechanism applies to user prompts, uploaded files, generated text, generated images, generated videos, characters, comments, project content, profile information, public listings, and any other content submitted to or produced through the Service.</p>
		</div>

		<div>
			<h2 class="mb-2 text-lg font-bold text-[var(--text-primary)]">Prohibited Content</h2>
			<p>Users may not upload, generate, request, publish, share, or distribute unlawful, infringing, abusive, deceptive, exploitative, violent, hateful, harassing, sexual, privacy-invasive, malware-related, or otherwise harmful content. Users are also responsible for ensuring they have the rights and permissions needed for any content they submit.</p>
		</div>

		<div>
			<h2 class="mb-2 text-lg font-bold text-[var(--text-primary)]">Review Methods</h2>
			<ul class="list-disc space-y-2 pl-5">
				<li><strong>Automated review:</strong> We may use automated filters, model-provider safety systems, keyword matching, file checks, abuse detection, rate limits, and risk signals to identify potentially prohibited or high-risk content.</li>
				<li><strong>Manual review:</strong> Content may be reviewed by authorized personnel when it is reported, flagged by automated systems, associated with payment or account risk, or otherwise requires human assessment.</li>
				<li><strong>Provider review:</strong> Third-party AI model, infrastructure, storage, or payment providers may apply their own safety, abuse, and compliance checks when their services are used.</li>
			</ul>
		</div>

		<div>
			<h2 class="mb-2 text-lg font-bold text-[var(--text-primary)]">Moderation Actions</h2>
			<p>Depending on the severity, context, and applicable law, we may refuse generation, block uploads, hide content, remove content, restrict sharing, disable public visibility, suspend features, limit account access, terminate accounts, preserve records for compliance, or report serious unlawful activity to appropriate authorities where required.</p>
		</div>

		<div>
			<h2 class="mb-2 text-lg font-bold text-[var(--text-primary)]">User Reporting</h2>
			<p>If you believe content on the Service is unlawful, infringing, harmful, or violates our terms, contact us at <a class="font-semibold text-[var(--text-primary)] underline underline-offset-2" :href="`mailto:${companyInfo.supportChannel}`">{{ companyInfo.supportChannel }}</a>. Please include the relevant account, URL, task ID, screenshot, order number, or other details that help us locate and review the content.</p>
		</div>

		<div>
			<h2 class="mb-2 text-lg font-bold text-[var(--text-primary)]">Appeals and Corrections</h2>
			<p>If you believe content or an account was restricted by mistake, you may contact us at <a class="font-semibold text-[var(--text-primary)] underline underline-offset-2" :href="`mailto:${companyInfo.supportChannel}`">{{ companyInfo.supportChannel }}</a> and provide the relevant details. We may review the decision where appropriate, but we are not required to restore content that violates law, third-party rights, provider policies, payment rules, or our Terms of Service.</p>
		</div>

		<div>
			<h2 class="mb-2 text-lg font-bold text-[var(--text-primary)]">Repeat Violations</h2>
			<p>Accounts involved in repeated violations, severe abuse, attempts to bypass safety controls, fraudulent activity, or unlawful conduct may be suspended or terminated without prior notice.</p>
		</div>

		<div>
			<h2 class="mb-2 text-lg font-bold text-[var(--text-primary)]">Contact</h2>
			<p><strong>Support:</strong> <a class="font-semibold text-[var(--text-primary)] underline underline-offset-2" :href="`mailto:${companyInfo.supportChannel}`">{{ companyInfo.supportChannel }}</a></p>
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
