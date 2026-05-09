export const COMPANY_INFO = {
	brandName: 'MixU AI',
	operatorNameEn: 'LUBAN MASTER CO., LIMITED',
	operatorNameZh: '魯班大師有限公司',
	registrationNumber: '77607308',
	registeredAddress: 'Flat 12A, 18/F, Prosperity Building, 88 Nathan Road, Tsim Sha Tsui, Kowloon, Hong Kong',
	supportChannel: 'the in-product support channel',
} as const

export const COMPANY_OPERATOR_NAME = `${COMPANY_INFO.operatorNameEn} (${COMPANY_INFO.operatorNameZh})`
