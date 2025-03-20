import { Button, Container, ProgressTabs, Text } from '@medusajs/ui';
import { useAdminStore } from 'medusa-react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

const Guide: React.FC = () => {
	const navigate = useNavigate();
	const { t } = useTranslation();

	const { store } = useAdminStore();

	const handleNavigation = (path: string) => {
		navigate(path);
	};
	const getGreeting = () => {
		const hour = new Date().getHours();
		if (hour < 12) {
			return t('guide-steps-greeting-good-morning', 'Good morning');
		} else if (hour < 18) {
			return t('guide-steps-greeting-good-afternoon', 'Good afternoon');
		} else {
			return t('guide-steps-greeting-good-evening', 'Good evening');
		}
	};

	return (
		<>
			<div className="px-2 py-4">
				<Text className="text-xl font-bold">
					{t('guide-greeting', `Hello! Welcome to ${store?.name} store!`, {
						time: getGreeting(),
						name: store?.name,
					})}
				</Text>
				<span>
					<Text className="text-sm text-ui-text-secondary">
						{t('guide-steps-description-prefix', `The address of your mall is `)}
						<a
							href={`https://${store?.name}.fs6688.com`}
							target="_blank"
							className="cursor-pointer hover:underline text-blue-500 font-bold"
						>
							{`https://${store?.name}.fs6688.com`}
						</a>
						。
						{t(
							'guide-steps-description-suffix',
							`Please follow the steps below to complete the store setting.`
						)}
					</Text>
				</span>
			</div>
			<Container>
				<div className="w-full flex flex-col gap-4">
					<Text className="text-base font-bold">
						{t('guide-steps', 'Complete the following four steps to start your store:')}
					</Text>

					<ProgressTabs defaultValue="general">
						{/* Tab 列表 */}
						<div className="border-b border-ui-border-base">
							<ProgressTabs.List>
								<ProgressTabs.Trigger value="general">
									{t('guide-tab-general', 'Add Products')}
								</ProgressTabs.Trigger>
								<ProgressTabs.Trigger value="shipping">
									{t('guide-tab-shipping', 'Set Shipping')}
								</ProgressTabs.Trigger>
								<ProgressTabs.Trigger value="payment">
									{t('guide-tab-payment', 'Set Payment')}
								</ProgressTabs.Trigger>
								<ProgressTabs.Trigger value="design">
									{t('guide-tab-design', 'Design Your Store')}
								</ProgressTabs.Trigger>
							</ProgressTabs.List>
						</div>

						{/* Tab 内容 */}
						<div className="mt-2">
							{/* 添加商品 Tab */}
							<ProgressTabs.Content value="general">
								<div className="flex flex-col gap-4 py-8 px-4">
									<Text size="large" className="font-semibold">
										{t('guide-general-title', 'Add/Import Your First Product')}
									</Text>
									<ul className="text-ui-text-secondary text-sm list-disc pl-4">
										<li>
											{t(
												'guide-general-step1',
												'Add products manually: Ideal for personalized or limited products.'
											)}
										</li>
										<li>
											{t(
												'guide-general-step2',
												'Import from product marketplace: Quickly add products for larger inventories.'
											)}
										</li>
									</ul>
									<div className="flex gap-2">
										<Button onClick={() => handleNavigation('/a/products')}>
											{t('guide-general-action1', 'Add Manually')}
										</Button>
										<Button onClick={() => window.open('https://fs6688.com', '_blank')}>
											{t('guide-general-action2', 'Import from Marketplace')}
										</Button>
									</div>
								</div>
							</ProgressTabs.Content>

							{/* 设置物流 Tab */}
							<ProgressTabs.Content value="shipping">
								<div className="flex flex-col gap-4 py-8 px-4">
									<Text size="large" className="font-semibold">
										{t('guide-shipping-title', 'Set Up Shipping')}
									</Text>
									<Text size="small" className="text-ui-text-secondary">
										{t(
											'guide-shipping-description',
											"Configure your store's shipping options to ensure customers receive their orders conveniently. Complete the following steps:"
										)}
									</Text>
									<ul className="text-ui-text-secondary text-sm list-disc pl-4">
										<li>
											{t(
												'guide-shipping-step1',
												'Select shipping services: Integrate multiple providers to meet different needs.'
											)}
										</li>
										<li>
											{t(
												'guide-shipping-step2',
												'Set shipping rates: Define rules based on region, weight, or price.'
											)}
										</li>
										<li>
											{t(
												'guide-shipping-step3',
												'Enable international shipping: Expand your reach to global customers.'
											)}
										</li>
									</ul>
									<Button>{t('guide-shipping-action1', 'Set Up Shipping')}</Button>
								</div>
							</ProgressTabs.Content>

							{/* 设置收款 Tab */}
							<ProgressTabs.Content value="payment">
								<div className="flex flex-col gap-4 py-8 px-4">
									<Text size="large" className="font-semibold">
										{t('guide-payment-title', 'Set Up Payment Methods')}
									</Text>
									<Text size="small" className="text-ui-text-secondary">
										{t(
											'guide-payment-description',
											'Ensure customers can complete payments smoothly. Set up payment methods with these steps:'
										)}
									</Text>
									<ul className="text-ui-text-secondary text-sm list-disc pl-4">
										<li>
											{t(
												'guide-payment-step1',
												'Add mainstream payment options: Support credit cards, PayPal, and more.'
											)}
										</li>
										<li>
											{t(
												'guide-payment-step2',
												'Enable local payment: Add localized options for different regions.'
											)}
										</li>
										<li>
											{t(
												'guide-payment-step3',
												'Verify account information: Ensure correct account settings for receiving funds.'
											)}
										</li>
									</ul>
									<Button>{t('guide-payment-action1', 'Set Up Payment')}</Button>
								</div>
							</ProgressTabs.Content>

							{/* 装修店铺 Tab */}
							<ProgressTabs.Content value="design">
								<div className="flex flex-col gap-4 py-8 px-4">
									<Text size="large" className="font-semibold">
										{t('guide-design-title', 'Design Your Store')}
									</Text>
									<Text size="small" className="text-ui-text-secondary">
										{t(
											'guide-design-description',
											'A unique and professional store design attracts more customers. Follow these steps:'
										)}
									</Text>
									<ul className="text-ui-text-secondary text-sm list-disc pl-4">
										<li>
											{t(
												'guide-design-step1',
												'Choose a store theme: Select a design that suits your brand.'
											)}
										</li>
										<li>
											{t(
												'guide-design-step2',
												'Upload a brand logo: Strengthen recognition with a unique identity.'
											)}
										</li>
										<li>
											{t(
												'guide-design-step3',
												'Set colors and fonts: Customize based on brand style.'
											)}
										</li>
										<li>
											{t(
												'guide-design-step4',
												'Add page content: Configure key pages like Home, About Us, and Contact Us.'
											)}
										</li>
									</ul>
									<Button>{t('guide-design-action1', 'Customize Your Store')}</Button>
								</div>
							</ProgressTabs.Content>
						</div>
					</ProgressTabs>
				</div>
			</Container>
		</>
	);
};

export default Guide;
