<template>
	<!-- Manus Style Desktop Sidebar -->
	<aside :class="['hidden lg:flex flex-col h-full bg-[var(--bg-sidebar)] text-[var(--text-secondary)] border-r border-[var(--border-light)] transition-all duration-300 relative z-[40] overflow-hidden flex-shrink-0', uiStore.sidebarCollapsed ? 'w-[68px]' : 'w-[300px]']">
		<!-- Top Section: Logo & Collapse -->
		<div class="flex items-center justify-between h-[56px] py-[12px] pe-[10px] ps-[12px] shrink-0">
			<!-- Logo Section -->
			<div v-show="!uiStore.sidebarCollapsed" class="flex items-center gap-1 ps-[8px] clickable">
				<div class="flex items-center h-7 overflow-hidden">
					<svg xmlns="http://www.w3.org/2000/svg" width="64.8" height="28" viewBox="0 0 88 38" fill="none" class="text-[var(--text-primary)]">
						<path d="M75.9757 24.9999H75.2937V20.9959H76.2177C76.4677 22.0519 76.8267 22.8219 77.2957 23.3059C77.7657 23.7899 78.3737 24.0319 79.1217 24.0319C79.6647 24.0319 80.0827 23.9219 80.3757 23.7019C80.6837 23.4672 80.8377 23.1519 80.8377 22.7559C80.8377 22.3452 80.6547 21.9492 80.2877 21.5679C79.9217 21.1719 79.3277 20.7539 78.5057 20.3139C77.3917 19.7126 76.5917 19.1186 76.1077 18.5319C75.6237 17.9306 75.3817 17.2559 75.3817 16.5079C75.3817 16.0239 75.4697 15.5766 75.6457 15.1659C75.8367 14.7406 76.0857 14.3739 76.3937 14.0659C76.7167 13.7579 77.0977 13.5232 77.5377 13.3619C77.9777 13.1859 78.4547 13.0979 78.9677 13.0979C79.4227 13.0979 79.8697 13.1639 80.3097 13.2959C80.7647 13.4279 81.1607 13.6112 81.4977 13.8459L81.8937 13.3179H82.4657V16.6399H81.6077C81.2707 15.8039 80.9187 15.2026 80.5517 14.8359C80.1997 14.4692 79.7677 14.2859 79.2537 14.2859C78.8437 14.2859 78.5137 14.3959 78.2637 14.6159C78.0297 14.8359 77.9117 15.1292 77.9117 15.4959C77.9117 15.9066 78.0877 16.2952 78.4397 16.6619C78.8067 17.0286 79.4077 17.4319 80.2437 17.8719C80.8307 18.1946 81.3367 18.5099 81.7617 18.8179C82.1877 19.1259 82.5317 19.4412 82.7957 19.7639C83.0597 20.0719 83.2507 20.4019 83.3677 20.7539C83.4997 21.0912 83.5657 21.4579 83.5657 21.8539C83.5657 22.3672 83.4707 22.8292 83.2797 23.2399C83.0897 23.6506 82.8177 24.0026 82.4657 24.2959C82.1137 24.5892 81.6887 24.8166 81.1897 24.9779C80.7057 25.1392 80.1637 25.2199 79.5617 25.2199C78.9317 25.2199 78.3447 25.1392 77.8017 24.9779C77.2597 24.8019 76.8117 24.5526 76.4597 24.2299L75.9757 24.9999Z" fill="currentColor"></path>
						<path d="M68.9587 16.9478C68.9587 16.3612 68.9437 15.8992 68.9147 15.5618C68.8853 15.2098 68.8047 14.9458 68.6727 14.7698C68.5407 14.5792 68.3427 14.4545 68.0787 14.3958C67.8293 14.3225 67.4847 14.2638 67.0447 14.2198V13.3398H72.0167V20.0058C72.0167 20.9005 72.0237 21.6045 72.0387 22.1178C72.0677 22.6165 72.1117 22.9905 72.1707 23.2398C72.2147 23.4305 72.2657 23.5845 72.3247 23.7018C72.3837 23.8045 72.4787 23.8925 72.6107 23.9658C72.7427 24.0245 72.9187 24.0685 73.1387 24.0978C73.3737 24.1125 73.6737 24.1198 74.0407 24.1198V24.9778L69.6627 25.2418L69.4207 23.2838H69.3327C68.9517 23.8998 68.416 24.3765 67.7267 24.7138C67.0373 25.0512 66.2673 25.2198 65.4167 25.2198C63.8473 25.2198 62.652 24.6625 61.8307 23.5478C61.2 22.6972 60.8847 21.4872 60.8847 19.9178V16.9478C60.8847 16.3465 60.87 15.8772 60.8407 15.5398C60.8113 15.1878 60.7307 14.9238 60.5987 14.7478C60.4813 14.5718 60.298 14.4545 60.0487 14.3958C59.7993 14.3225 59.4547 14.2638 59.0147 14.2198V13.3398H63.9427V19.5658C63.9427 21.0472 64.126 22.1252 64.4927 22.7998C64.8593 23.4598 65.446 23.7898 66.2527 23.7898C67.118 23.7898 67.7853 23.3938 68.2547 22.6018C68.724 21.8392 68.9587 20.7172 68.9587 19.2358V16.9478Z" fill="currentColor"></path>
						<path d="M48.6182 21.4139C48.6182 22.0152 48.6328 22.4919 48.6622 22.8439C48.7062 23.1812 48.7868 23.4452 48.9042 23.6359C49.0362 23.8119 49.2268 23.9292 49.4762 23.9879C49.7402 24.0465 50.0922 24.0905 50.5322 24.1199V24.9999H43.6022V24.1199C44.0275 24.0905 44.3648 24.0465 44.6142 23.9879C44.8782 23.9292 45.0762 23.8119 45.2082 23.6359C45.3548 23.4599 45.4502 23.2105 45.4942 22.8879C45.5392 22.5652 45.5602 22.1252 45.5602 21.5679V18.8179C45.5602 17.9525 45.5455 17.2559 45.5162 16.7279C45.4868 16.1852 45.4502 15.8185 45.4062 15.6279C45.3622 15.4372 45.3035 15.2832 45.2302 15.1659C45.1568 15.0339 45.0468 14.9385 44.9002 14.8799C44.7535 14.8065 44.5702 14.7625 44.3502 14.7479C44.1302 14.7185 43.8515 14.7039 43.5142 14.7039V13.9559L47.7602 13.1199L48.0462 15.0559H48.1342C48.6182 14.4399 49.1902 13.9632 49.8502 13.6259C50.5102 13.2885 51.2362 13.1199 52.0282 13.1199C52.9668 13.1199 53.7222 13.2519 54.2942 13.5159C54.8808 13.7652 55.4015 14.1905 55.8562 14.7919C56.1055 15.1292 56.3255 15.5692 56.5162 16.1119C56.7068 16.6399 56.8022 17.3732 56.8022 18.3119V21.4139C56.8022 22.0152 56.8168 22.4919 56.8462 22.8439C56.8902 23.1812 56.9708 23.4452 57.0882 23.6359C57.2202 23.8119 57.4108 23.9292 57.6602 23.9879C57.9095 24.0465 58.2468 24.0905 58.6722 24.1199V24.9999H51.7862V24.1199C52.2262 24.1052 52.5708 24.0685 52.8202 24.0099C53.0842 23.9365 53.2822 23.8119 53.4142 23.6359C53.5462 23.4599 53.6342 23.2105 53.6782 22.8879C53.7222 22.5505 53.7442 22.1105 53.7442 21.5679V18.5759C53.7442 17.8279 53.7002 17.1972 53.6122 16.6839C53.5242 16.1705 53.3775 15.7599 53.1722 15.4519C52.9815 15.1292 52.7248 14.9019 52.4022 14.7699C52.0795 14.6232 51.6762 14.5499 51.1922 14.5499C50.7228 14.5499 50.3195 14.6819 49.9822 14.9459C49.6448 15.2099 49.3515 15.5765 49.1022 16.0459C48.9702 16.3099 48.8528 16.6545 48.7502 17.0799C48.6622 17.4905 48.6182 17.9232 48.6182 18.3779V21.4139Z" fill="currentColor"></path>
						<path d="M38.1193 18.7299C36.8873 19.2872 35.9560 19.8079 35.3253 20.2919C34.7093 20.7612 34.4013 21.2525 34.4013 21.7659C34.4013 22.1912 34.5187 22.5285 34.7533 22.7779C34.9880 23.0272 35.2813 23.1519 35.6333 23.1519C35.9853 23.1519 36.3153 23.0932 36.6233 22.9759C36.9313 22.8439 37.1953 22.6752 37.4153 22.4699C37.6353 22.2645 37.8040 22.0225 37.9213 21.7439C38.0533 21.4505 38.1193 21.1425 38.1193 20.8199V18.7299ZM38.1193 17.5639V16.6399C38.1193 15.7892 37.9653 15.1732 37.6573 14.7919C37.3640 14.3959 36.9020 14.1979 36.2713 14.1979C35.8460 14.1979 35.5233 14.3152 35.3033 14.5499C35.0833 14.7699 34.8780 15.1439 34.6873 15.6719C34.5553 16.0385 34.3647 16.3245 34.1153 16.5299C33.8807 16.7352 33.5507 16.8379 33.1253 16.8379C32.7147 16.8379 32.3993 16.7132 32.1793 16.4639C31.9593 16.2145 31.8493 15.8625 31.8493 15.4079C31.8493 14.7039 32.2307 14.1465 32.9933 13.7359C33.7707 13.3252 34.9367 13.1199 36.4913 13.1199C38.1340 13.1199 39.3073 13.4205 40.0113 14.0219C40.7153 14.6085 41.0673 15.5985 41.0673 16.9919V21.8099C41.0673 23.0565 41.3167 23.6799 41.8153 23.6799C42.0940 23.6799 42.3507 23.5845 42.5853 23.3939L42.9153 24.0319C42.7100 24.3985 42.3873 24.6919 41.9473 24.9119C41.5220 25.1172 41.0380 25.2199 40.4953 25.2199C39.8207 25.2199 39.3073 25.0145 38.9553 24.6039C38.6033 24.1932 38.4273 23.6139 38.4273 22.8659H38.3173C37.8920 23.6285 37.3420 24.2079 36.6673 24.6039C35.9927 24.9999 35.2227 25.1979 34.3573 25.1979C33.4333 25.1979 32.6927 24.9412 32.1353 24.4279C31.5780 23.8999 31.2993 23.2179 31.2993 22.3819C31.2993 21.7365 31.5853 21.1352 32.1573 20.5779C32.7293 20.0059 33.6827 19.4485 35.0173 18.9059L38.1193 17.5639Z" fill="currentColor"></path>
						<path d="M12.1055 21.3699C12.1055 21.9859 12.1201 22.4699 12.1495 22.8219C12.1788 23.1739 12.2595 23.4452 12.3915 23.6359C12.5235 23.8119 12.7141 23.9292 12.9635 23.9879C13.2128 24.0465 13.5575 24.0905 13.9975 24.1199V24.9999H7.04549V24.1199C7.48549 24.0905 7.83749 24.0465 8.10149 23.9879C8.36549 23.9292 8.56349 23.8119 8.69549 23.6359C8.82749 23.4599 8.91549 23.2105 8.95949 22.8879C9.00349 22.5505 9.02549 22.1032 9.02549 21.5459V18.8179C9.02549 17.9819 9.01079 17.2852 8.98149 16.7279C8.96679 16.1705 8.93009 15.7892 8.87149 15.5839C8.82749 15.3932 8.76879 15.2465 8.69549 15.1439C8.63679 15.0265 8.53409 14.9385 8.38749 14.8799C8.25549 14.8065 8.07949 14.7625 7.85949 14.7479C7.63949 14.7185 7.35349 14.7039 7.00149 14.7039V13.9559L11.2475 13.1199L11.5115 15.0339H11.6435C12.2595 14.3445 12.8755 13.8532 13.4915 13.5599C14.1221 13.2665 14.8481 13.1199 15.6695 13.1199C16.6375 13.1199 17.4368 13.2885 18.0675 13.6259C18.6981 13.9632 19.1748 14.4472 19.4975 15.0779H19.5855C20.1135 14.4619 20.7441 13.9852 21.4775 13.6479C22.2108 13.2959 22.9955 13.1199 23.8315 13.1199C24.7115 13.1199 25.4741 13.2299 26.1195 13.4499C26.7795 13.6699 27.2928 13.9852 27.6595 14.3959C27.9528 14.7332 28.1655 15.1732 28.2975 15.7159C28.4441 16.2585 28.5175 17.0139 28.5175 17.9819V21.3699C28.5175 21.9712 28.5321 22.4479 28.5615 22.7999C28.6055 23.1519 28.6935 23.4232 28.8255 23.6139C28.9575 23.8045 29.1481 23.9292 29.3975 23.9879C29.6468 24.0465 29.9915 24.0905 30.4315 24.1199V24.9999H23.4795V24.1199C23.9195 24.1052 24.2641 24.0685 24.5135 24.0099C24.7775 23.9365 24.9755 23.8119 25.1075 23.6359C25.2541 23.4452 25.3421 23.1885 25.3715 22.8659C25.4155 22.5432 25.4375 22.1032 25.4375 21.5459V18.6639C25.4375 17.9012 25.3935 17.2559 25.3055 16.7279C25.2175 16.1999 25.0781 15.7745 24.8875 15.4519C24.6968 15.1292 24.4401 14.9019 24.1175 14.7699C23.8095 14.6232 23.4281 14.5499 22.9735 14.5499C22.4601 14.5499 22.0348 14.6745 21.6975 14.9239C21.3748 15.1732 21.1035 15.4959 20.8835 15.8919C20.5021 16.5812 20.3115 17.4392 20.3115 18.4659V21.3699C20.3115 21.9712 20.3261 22.4479 20.3555 22.7999C20.3848 23.1519 20.4655 23.4232 20.5975 23.6139C20.7295 23.8045 20.9201 23.9292 21.1695 23.9879C21.4335 24.0465 21.7928 24.0905 22.2475 24.1199V24.9999H15.2735V24.1199C15.7135 24.0905 16.0581 24.0465 16.3075 23.9879C16.5715 23.9292 16.7695 23.8119 16.9015 23.6359C17.0481 23.4599 17.1361 23.2105 17.1655 22.8879C17.2095 22.5505 17.2315 22.1032 17.2315 21.5459V18.6639C17.2315 17.9012 17.1875 17.2559 17.0995 16.7279C17.0115 16.1999 16.8648 15.7745 16.6595 15.4519C16.4688 15.1292 16.2121 14.9019 15.8895 14.7699C15.5668 14.6232 15.1635 14.5499 14.6795 14.5499C14.1955 14.5499 13.7921 14.6672 13.4695 14.9019C13.1615 15.1365 12.9048 15.4519 12.6995 15.8479C12.5088 16.1999 12.3621 16.6032 12.2595 17.0579C12.1568 17.5125 12.1055 17.9819 12.1055 18.4659V21.3699Z" fill="currentColor"></path>
					</svg>
				</div>
			</div>
			
			<div @click="uiStore.toggleSidebar" class="flex items-center justify-center rounded-md hover:bg-[var(--bg-hover)] cursor-pointer size-[32px] shrink-0 transition-colors">
				<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-panel-left text-[var(--text-secondary)] size-[18px]">
					<rect width="18" height="18" x="3" y="3" rx="2"></rect>
					<path d="M9 3v18"></path>
				</svg>
			</div>
		</div>

		<!-- Nav Items Section -->
		<div class="flex flex-col flex-1 min-h-0 p-[8px] pb-0 gap-px transition-all">
			<!-- New Task -->
			<div @click="handleNewChat" class="flex items-center rounded-[10px] clickable cursor-pointer transition-colors w-full gap-[12px] h-[36px] hover:bg-[var(--bg-hover)] ps-[9px] pe-[2px]">
				<div class="shrink-0 size-[18px] flex items-center justify-center text-[var(--text-primary)]">
					<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-square-pen">
						<path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
						<path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z"></path>
					</svg>
				</div>
				<div v-show="!uiStore.sidebarCollapsed" class="flex-1 min-w-0 flex gap-[4px] items-center text-[14px] font-medium text-[var(--text-primary)]">
					<span class="truncate">New task</span>
				</div>
			</div>

			<!-- Search -->
			<div @click="uiStore.openSearchModal" class="flex items-center rounded-[10px] clickable cursor-pointer transition-colors w-full gap-[12px] h-[36px] hover:bg-[var(--bg-hover)] ps-[9px] pe-[2px] group">
				<div class="shrink-0 size-[18px] flex items-center justify-center text-[var(--text-secondary)]">
					<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-search">
						<path d="m21 21-4.34-4.34"></path>
						<circle cx="11" cy="11" r="8"></circle>
					</svg>
				</div>
				<div v-show="!uiStore.sidebarCollapsed" class="flex-1 min-w-0 flex gap-[4px] items-center text-[14px] font-medium text-[var(--text-primary)]">
					<span class="truncate">Search</span>
				</div>
				<div v-show="!uiStore.sidebarCollapsed" class="shrink-0 flex items-center">
					<div class="text-[var(--text-tertiary)] text-sm hidden group-hover:inline-flex items-center gap-1 pe-[8px]">
						⌘ K
					</div>
				</div>
			</div>

			<!-- Library -->
			<div class="flex items-center rounded-[10px] clickable cursor-pointer transition-colors w-full gap-[12px] h-[36px] hover:bg-[var(--bg-hover)] ps-[9px] pe-[2px]">
				<div class="shrink-0 size-[18px] flex items-center justify-center text-[var(--text-secondary)]">
					<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-library-big">
						<rect width="8" height="18" x="3" y="3" rx="1"></rect>
						<path d="M7 3v18"></path>
						<path d="M20.4 18.9c.2.5-.1 1.1-.6 1.3l-1.9.7c-.5.2-1.1-.1-1.3-.6L11.1 5.1c-.2-.5.1-1.1.6-1.3l1.9-.7c.5-.2 1.1.1 1.3.6Z"></path>
					</svg>
				</div>
				<div v-show="!uiStore.sidebarCollapsed" class="flex-1 min-w-0 flex gap-[4px] items-center text-[14px] font-medium text-[var(--text-primary)]">
					<span class="truncate">Library</span>
				</div>
			</div>

			<!-- History Content (Scrollable) -->
			<div class="flex flex-col flex-1 min-h-0 -mx-[8px] transition-all overflow-hidden" style="opacity: 1">
				<div class="w-full border-t-[1px] border-[var(--border-light)] opacity-50 my-2"></div>
				<div class="flex flex-col flex-1 min-h-0 overflow-x-hidden overflow-y-auto custom-scrollbar pt-0 px-[8px]">
					<!-- Projects Toggle -->
					<div @click="toggleProjects" class="group flex items-center justify-between ps-[10px] pe-[2px] py-[2px] h-[36px] gap-[12px] clickable hover:bg-[var(--bg-hover)] transition-colors active:bg-[var(--bg-hover)] rounded-[10px] mb-1">
						<div class="flex items-center flex-1 min-w-0 gap-0.5">
							<span class="text-[12px] leading-[18px] text-[var(--text-tertiary)] font-medium min-w-0 truncate tracking-tight uppercase">Projects</span>
							<svg v-if="!uiStore.sidebarCollapsed" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" :class="['lucide lucide-chevron-up transition-all shrink-0 group-hover:opacity-100 text-[var(--text-tertiary)]', projectsCollapsed ? 'rotate-180' : '']">
								<path d="m18 15-6-6-6 6"></path>
							</svg>
						</div>
						<div v-if="!uiStore.sidebarCollapsed" @click.stop="openCreateProjectModal" class="flex items-center justify-center size-[32px] rounded-[8px] hover:bg-[var(--bg-hover)] clickable transition-colors">
							<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-plus text-[var(--text-tertiary)]">
								<path d="M5 12h14"></path>
								<path d="M12 5v14"></path>
							</svg>
						</div>
					</div>

					<!-- Project List -->
					<div v-show="!projectsCollapsed" class="flex flex-col gap-px mb-4">
						<div @click="selectProject(null)" :class="['w-full flex items-center rounded-[10px] h-[36px] ps-[10px] pe-[8px] gap-[8px] transition-colors clickable', (conversationStore.selectedGroupId === null || conversationStore.selectedGroupId === 0) ? 'bg-[var(--bg-hover)]' : 'hover:bg-[var(--bg-hover)]']">
							<div class="shrink-0 size-[18px] flex items-center justify-center text-[var(--text-secondary)] opacity-80">
								<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
									<path d="M4 6h16M4 12h16M4 18h7" />
								</svg>
							</div>
							<div v-show="!uiStore.sidebarCollapsed" class="flex-1 min-w-0 flex items-center text-[14px] text-[var(--text-primary)] font-medium overflow-hidden">
								<span class="truncate">All Sessions</span>
							</div>
						</div>
						<div v-for="group in projectStore.projects" :key="group.id" @click="selectProject(group.id)" :class="['w-full group flex items-center rounded-[10px] h-[36px] ps-[10px] pe-[8px] gap-[8px] transition-colors clickable relative', conversationStore.selectedGroupId == group.id ? 'bg-[var(--bg-hover)]' : 'hover:bg-[var(--bg-hover)]']">
							<div class="shrink-0 size-[18px] flex items-center justify-center text-[var(--text-secondary)] opacity-80">
								<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
									<path d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
								</svg>
							</div>
							<div v-show="!uiStore.sidebarCollapsed" class="flex-1 min-w-0 flex items-center text-[14px] text-[var(--text-primary)] font-medium overflow-hidden">
								<span class="truncate">{{ group.name }}</span>
							</div>
							<!-- Project Actions -->
							<div v-show="!uiStore.sidebarCollapsed" class="shrink-0 flex items-center gap-0.5">
								<div @click.stop="handleEditProject(group)" class="size-7 flex rounded-[8px] items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 hover:bg-[var(--bg-sidebar)] transition-all text-[var(--text-tertiary)]">
									<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-pencil">
										<path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>
									</svg>
								</div>
								<div @click.stop="handleDeleteProject(group.id)" class="size-7 flex rounded-[8px] items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 hover:bg-[var(--bg-sidebar)] transition-all text-[var(--text-tertiary)]">
									<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash-2">
										<path d="M3 6h18"></path>
										<path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
										<path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
									</svg>
								</div>
							</div>
						</div>
					</div>

					<!-- Recent Chat Header -->
					<div class="group flex items-center justify-between ps-[10px] pe-[2px] py-[2px] h-[36px] gap-[12px] rounded-[10px] mb-1">
						<span class="text-[12px] leading-[18px] text-[var(--text-tertiary)] font-medium min-w-0 truncate tracking-tight uppercase">Recent Chat</span>
					</div>

					<!-- Chat List -->
					<div class="flex flex-col gap-px">
						<div v-for="conversation in sortedConversations" :key="conversation.id" @click="handleSelectConversation(String(conversation.id))" :class="['group flex items-center rounded-[10px] clickable cursor-pointer transition-all w-full gap-[12px] h-[36px] ps-[9px] pe-[2px]', conversationStore.currentConversationId == conversation.id ? 'bg-[var(--bg-hover)]' : 'hover:bg-[var(--bg-hover)]']">
							<div class="shrink-0 size-[18px] flex items-center justify-center text-[var(--text-secondary)] opacity-60">
								<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
									<path d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
								</svg>
							</div>
							<div v-show="!uiStore.sidebarCollapsed" class="flex-1 min-w-0 flex items-center text-[14px] text-[var(--text-primary)] font-medium overflow-hidden">
								<span class="truncate">{{ conversation.title || 'New conversation' }}</span>
							</div>
							<div v-show="!uiStore.sidebarCollapsed" class="shrink-0 flex items-center">
								<!-- Conversation Action Menu -->
								<Menu as="div" class="relative inline-block text-left">
									<MenuButton 
										@click.stop="handleMenuClick($event, conversation.id)" 
										class="size-7 flex rounded-[8px] items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 hover:bg-[var(--bg-hover)] transition-all text-[var(--text-tertiary)]"
									>
										<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-more-horizontal">
											<circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/>
										</svg>
									</MenuButton>

									<Teleport to="body">
										<transition
											enter-active-class="transition duration-100 ease-out"
											enter-from-class="transform scale-95 opacity-0"
											enter-to-class="transform scale-100 opacity-100"
											leave-active-class="transition duration-75 ease-in"
											leave-from-class="transform scale-100 opacity-100"
											leave-to-class="transform scale-95 opacity-0"
										>
											<MenuItems 
												v-if="activeMenuId === conversation.id"
												class="fixed w-56 origin-top-right divide-y divide-[var(--border-light)] rounded-[12px] bg-[var(--background-white-main)] shadow-[var(--shadow-XL)] border border-[var(--border-main)] focus:outline-none z-[100] overflow-hidden"
												:style="menuPosition"
											>
												<div class="px-1 py-1">
													<MenuItem v-slot="{ active }">
														<button :class="[active ? 'bg-[var(--fill-tsp-white-main)]' : '', 'group flex w-full items-center gap-3 rounded-[8px] px-3 py-2 text-sm text-[var(--text-primary)] transition-colors']">
															<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="shrink-0 opacity-60">
																<path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" x2="12" y1="2" y2="15"/>
															</svg>
															Share
														</button>
													</MenuItem>
													<MenuItem v-slot="{ active }">
														<button @click="uiStore.openRenameModal(conversation)" :class="[active ? 'bg-[var(--fill-tsp-white-main)]' : '', 'group flex w-full items-center gap-3 rounded-[8px] px-3 py-2 text-sm text-[var(--text-primary)] transition-colors']">
															<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="shrink-0 opacity-60">
																<path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>
															</svg>
															Rename
														</button>
													</MenuItem>
													<MenuItem v-slot="{ active }">
														<button :class="[active ? 'bg-[var(--fill-tsp-white-main)]' : '', 'group flex w-full items-center gap-3 rounded-[8px] px-3 py-2 text-sm text-[var(--text-primary)] transition-colors']">
															<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="shrink-0 opacity-60">
																<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
															</svg>
															Add to favorites
														</button>
													</MenuItem>
												</div>

												<div class="px-1 py-1">
													<MenuItem v-slot="{ active }">
														<button @click="handleOpenNewTab(conversation.id)" :class="[active ? 'bg-[var(--fill-tsp-white-main)]' : '', 'group flex w-full items-center gap-3 rounded-[8px] px-3 py-2 text-sm text-[var(--text-primary)] transition-colors']">
															<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="shrink-0 opacity-60">
																<path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" x2="21" y1="14" y2="3"/>
															</svg>
															Open in new tab
														</button>
													</MenuItem>
													
													<!-- Move to Project Submenu -->
													<div class="relative group/submenu">
														<MenuItem v-slot="{ active }">
															<div :class="[active ? 'bg-[var(--fill-tsp-white-main)]' : '', 'flex w-full items-center justify-between rounded-[8px] px-3 py-2 text-sm text-[var(--text-primary)] transition-colors cursor-pointer']">
																<div class="flex items-center gap-3">
																	<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="shrink-0 opacity-60">
																		<path d="M3 7v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-6l-2-2H5a2 2 0 0 0-2 2z" />
																	</svg>
																	Move to project
																</div>
																<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-right opacity-40">
																	<path d="m9 18 6-6-6-6"/>
																</svg>
															</div>
														</MenuItem>
														
														<!-- Submenu items -->
														<div class="absolute left-full top-0 ml-0 hidden group-hover/submenu:block w-48 rounded-[12px] bg-[var(--background-white-main)] shadow-[var(--shadow-XL)] border border-[var(--border-main)] focus:outline-none z-[60] p-1">
															<button 
																@click="handleMoveToProject(conversation.id, 0)" 
																class="flex w-full items-center gap-3 rounded-[8px] px-3 py-2 text-sm text-[var(--text-primary)] hover:bg-[var(--fill-tsp-white-main)] transition-colors"
															>
																Direct Chat
															</button>
															<button 
																v-for="proj in projectStore.projects" 
																:key="proj.id"
																@click="handleMoveToProject(conversation.id, proj.id)"
																class="flex w-full items-center gap-3 rounded-[8px] px-3 py-2 text-sm text-[var(--text-primary)] hover:bg-[var(--fill-tsp-white-main)] transition-colors"
															>
																{{ proj.name }}
															</button>
														</div>
													</div>
												</div>

												<div class="px-1 py-1">
													<MenuItem v-slot="{ active }">
														<button @click="handleDeleteConversation(String(conversation.id))" :class="[active ? 'bg-red-500/10 text-red-500' : 'text-red-500', 'group flex w-full items-center gap-3 rounded-[8px] px-3 py-2 text-sm transition-colors']">
															<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="shrink-0">
																<path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
															</svg>
															Delete
														</button>
													</MenuItem>
												</div>
											</MenuItems>
										</transition>
									</Teleport>
								</Menu>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- Bottom Section -->
		<div class="flex flex-col justify-center items-start gap-[8px] bg-[var(--bg-sidebar)] p-[8px] overflow-hidden border-t border-[var(--border-light)] shrink-0 transition-all duration-300">
			<!-- Share Card -->
			<button v-show="!uiStore.sidebarCollapsed" class="relative w-full rounded-[12px] border border-[var(--border-light)] clickable hover:opacity-90 text-sm text-[var(--text-primary)] transition-all bg-[var(--background-card-gray)] shadow-sm">
				<div class="flex w-full items-center justify-between ps-[9px] pe-[0px] py-[8px] rounded-[12px]">
					<div class="flex-1 min-w-0 flex items-center gap-[12px]">
						<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--text-primary)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-hand-heart flex-shrink-0">
							<path d="M11 14h2a2 2 0 0 0 0-4h-3c-.6 0-1.1.2-1.4.6L3 16"></path>
							<path d="m14.45 13.39 5.05-4.694C20.196 8 21 6.85 21 5.75a2.75 2.75 0 0 0-4.797-1.837.276.276 0 0 1-.406 0A2.75 2.75 0 0 0 11 5.75c0 1.2.802 2.248 1.5 2.946L16 11.95"></path>
							<path d="m2 15 6 6"></path>
							<path d="m7 20 1.6-1.4c.3-.4.8-.6 1.4-.6h4c1.1 0 2.1-.4 2.8-1.2l4.6-4.4a1 1 0 0 0-2.75-2.91"></path>
						</svg>
						<div class="flex flex-col text-start overflow-hidden">
							<span class="text-[var(--text-primary)] font-serif text-[14px] leading-[20px] truncate max-w-[200px]">Share Manus with a friend</span>
							<span class="text-[var(--text-tertiary)] text-[12px] leading-[16px] truncate">Get 500 credits each</span>
						</div>
					</div>
					<div class="flex items-center justify-center size-[32px] opacity-60">
						<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-right">
							<path d="m9 18 6-6-6-6"></path>
						</svg>
					</div>
				</div>
			</button>

			<div class="flex items-center w-full p-[2px] justify-between">
				<div class="flex items-center gap-[4px]">
					<!-- Settings -->
					<div @click="uiStore.openSettingsModal()" class="flex items-center justify-center cursor-pointer rounded-md hover:bg-[var(--fill-tsp-gray-main)] size-8 shrink-0 transition-colors">
						<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-settings-2 text-[var(--icon-primary)] size-[18px]">
							<path d="M14 17H5"></path>
							<path d="M19 7h-9"></path>
							<circle cx="17" cy="17" r="3"></circle>
							<circle cx="7" cy="7" r="3"></circle>
						</svg>
					</div>

					<!-- Tools / Apps -->
					<div class="flex items-center justify-center cursor-pointer rounded-md hover:bg-[var(--fill-tsp-gray-main)] size-8 shrink-0 transition-colors">
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" fill="none" width="16" height="16" class="text-[var(--icon-primary)] size-[18px]">
							<path d="M15.4286 7.55357H10.125L12.7768 2.25L15.4286 7.55357Z" stroke="currentColor" stroke-width="1.35" stroke-linecap="round" stroke-linejoin="round"></path>
							<circle cx="5.25" cy="12.75" r="2.25" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></circle>
							<path d="M10.5 10.5H15V14.25C15 14.6642 14.6642 15 14.25 15H11.25C10.8358 15 10.5 14.6642 10.5 14.25V10.5Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
							<path d="M3 3H7.5V6.75C7.5 7.16421 7.16421 7.5 6.75 7.5H3.75C3.33579 7.5 3 7.16421 3 6.75V3Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
						</svg>
					</div>
					<!-- Smartphone / Apps -->
					<div @click="uiStore.openMobileMenu()" class="flex items-center justify-center lg:hidden cursor-pointer rounded-md hover:bg-[var(--fill-tsp-gray-main)] size-8 shrink-0 transition-colors">
						<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-smartphone text-[var(--icon-primary)] size-[18px]">
							<rect width="14" height="20" x="5" y="2" rx="2" ry="2"></rect>
							<path d="M12 18h.01"></path>
						</svg>
					</div>
				</div>

				<div class="flex items-center gap-[4px]">
					<!-- Book / Docs -->
					<a href="https://manus.im/docs" target="_blank" rel="noreferrer" class="flex items-center justify-center cursor-pointer rounded-md hover:bg-[var(--fill-tsp-gray-main)] size-8 shrink-0 transition-colors">
						<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-book text-[var(--icon-primary)] size-[18px]">
							<path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20"></path>
						</svg>
					</a>
				</div>
			</div>
		</div>

        <!-- Global Modals -->
        <ProjectModal :show="uiStore.showProjectModal" :editingProject="currentEditingProject" @close="handleCloseProjectModal" @success="projectStore.fetchProjects" />
	</aside>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/vue'
import { useConversationStore } from '../stores/conversation'
import { useProjectStore } from '../stores/projects'
import { useUIStore } from '../stores/ui'
import ProjectModal from './ProjectModal.vue'

const router = useRouter()
const conversationStore = useConversationStore()
const projectStore = useProjectStore()
const uiStore = useUIStore()
const currentEditingProject = ref<any>(null)
const projectsCollapsed = ref(false)

// Action Menu State
const activeMenuId = ref<string | number | null>(null)
const menuPosition = ref({ top: '0px', left: '0px' })

const sortedConversations = computed(() => {
	return [...conversationStore.conversations].sort((a, b) => {
		return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
	})
})

const toggleProjects = () => {
    projectsCollapsed.value = !projectsCollapsed.value
}

const selectProject = (id: string | number | null) => {
	conversationStore.setSelectedGroupId(id === null ? null : Number(id))
}

const handleSelectConversation = (id: string) => {
	router.push(`/chat/${id}`)
}

const handleNewChat = () => {
	router.push('/')
}

const handleDeleteConversation = async (id: string) => {
	if (confirm('Delete this conversation?')) {
		await conversationStore.deleteConversation(id)
	}
}

const handleOpenNewTab = (id: string | number) => {
	window.open(`/chat/${id}`, '_blank')
}

const handleMoveToProject = async (conversationId: string | number, projectId: string | number) => {
	await conversationStore.moveToProject(conversationId, Number(projectId))
    activeMenuId.value = null
}

const handleMenuClick = (event: MouseEvent, id: string | number) => {
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect()
    activeMenuId.value = id
    // Adjust position to be below the button, aligned to its right
    menuPosition.value = {
        top: `${rect.bottom + 8}px`,
        left: `${rect.right - 224}px` // 224 is w-56
    }
}

const openCreateProjectModal = () => {
    currentEditingProject.value = null
    uiStore.setProjectModal(true)
}

const handleEditProject = (project: any) => {
    currentEditingProject.value = project
    uiStore.setProjectModal(true)
}

const handleCloseProjectModal = () => {
    uiStore.setProjectModal(false)
    currentEditingProject.value = null
}

const handleDeleteProject = async (id: string | number) => {
    if (confirm('Delete this project? All associated chats will also be deleted.')) {
        await projectStore.deleteProject(Number(id))
    }
}

onMounted(() => {
	if (conversationStore.conversations.length === 0) {
		conversationStore.fetchConversations()
	}
    if (projectStore.projects.length === 0) {
        projectStore.projects = [] // Initialize if empty
    }
})
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
	width: 4px;
}

.custom-scrollbar::-webkit-scrollbar-track {
	background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
	background: var(--border-light);
	border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
	background: var(--text-tertiary);
}

.clickable {
	cursor: pointer;
	user-select: none;
}
</style>
