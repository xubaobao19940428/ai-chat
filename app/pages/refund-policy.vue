<template>
	<LegalPageShell title="Refund Policy">
		<div>
			<p><strong>REFUND POLICY</strong></p>
			<p>This Refund Policy explains how refunds, subscription cancellation requests, and billing support are handled for MixU AI (the "Service"). The Service is operated by {{ companyOperatorName }}.</p>
		</div>

		<div>
			<h2 class="mb-2 text-lg font-bold text-[var(--text-primary)]">Digital Service Notice</h2>
			<p>MixU provides digital AI services, credits, VIP benefits, model access, image generation, video generation, and other instantly delivered digital products. Because these services may be consumed immediately after purchase, refund eligibility depends on whether any purchased credits, benefits, or digital services have been used.</p>
		</div>

		<div>
			<h2 class="mb-2 text-lg font-bold text-[var(--text-primary)]">Refund Eligibility</h2>
			<p>You may request a full refund within fourteen (14) days from the date of purchase only if you have not used, consumed, redeemed, or accessed any portion of the purchased credits, subscription benefits, VIP privileges, or digital services.</p>
			<p>Once any purchased credits are consumed, any subscription or VIP benefit is accessed, or any digital service is delivered or used, the purchase becomes final and non-refundable, except where required by applicable law.</p>
		</div>

		<div>
			<h2 class="mb-2 text-lg font-bold text-[var(--text-primary)]">Non-Refundable Items</h2>
			<ul class="list-disc space-y-2 pl-5">
				<li>Used or partially used credits, stars, generation quotas, VIP days, or subscription benefits.</li>
				<li>Completed AI chat, image generation, video generation, model usage, or other digital processing tasks.</li>
				<li>Purchases made for the wrong account, region, model, or product after successful delivery, unless required by law.</li>
				<li>Service interruptions caused by third-party model providers, payment channels, networks, or temporary maintenance, unless a duplicate charge or delivery failure is verified.</li>
			</ul>
		</div>

		<div>
			<h2 class="mb-2 text-lg font-bold text-[var(--text-primary)]">Duplicate Charges or Delivery Issues</h2>
			<p>If you were charged more than once for the same order, or if payment succeeded but the purchased credits or benefits were not delivered, contact us with your account email, order number, payment receipt, payment time, and screenshots where available. If the issue is verified, we may restore missing benefits, correct the order, or issue a refund where appropriate.</p>
		</div>

		<div>
			<h2 class="mb-2 text-lg font-bold text-[var(--text-primary)]">How to Request a Refund</h2>
			<p>To request a refund review, contact us at <a class="font-semibold text-[var(--text-primary)] underline underline-offset-2" :href="`mailto:${companyInfo.supportChannel}`">{{ companyInfo.supportChannel }}</a>. Include your account email, order number, purchase date, payment method, and the reason for your request. We may ask for additional information to verify the order and usage status.</p>
			<p>Refund reviews are handled on a case-by-case basis. Approved refunds will usually be returned to the original payment method, subject to the timing and rules of the payment processor.</p>
		</div>

		<div>
			<h2 class="mb-2 text-lg font-bold text-[var(--text-primary)]">Subscription Cancellation</h2>
			<p>At this time, MixU does not provide a self-service subscription management or cancellation page inside the product. Some paid products may be fixed-term VIP packages or credit packages and may not automatically renew.</p>
			<p>If your payment channel shows an active recurring subscription, or if you need help cancelling a subscription or renewal, contact us at <a class="font-semibold text-[var(--text-primary)] underline underline-offset-2" :href="`mailto:${companyInfo.supportChannel}`">{{ companyInfo.supportChannel }}</a>. Please include your account email, order number, payment receipt, and the subscription or renewal you want to cancel.</p>
			<p>Cancellation stops future renewal charges where a recurring subscription exists. It does not automatically create a refund for previously delivered or used digital services, credits, or benefits.</p>
		</div>

		<div>
			<h2 class="mb-2 text-lg font-bold text-[var(--text-primary)]">Policy Changes</h2>
			<p>We may update this Refund Policy from time to time. Updated versions will be posted on this page. Continued use of the Service after an update means you accept the updated policy.</p>
		</div>

		<div>
			<h2 class="mb-2 text-lg font-bold text-[var(--text-primary)]">Contact Us</h2>
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
