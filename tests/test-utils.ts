// Simple mock utilities for testing Clarity contracts without external dependencies

export function mockPrincipal(address: string) {
	return address
}

export function mockBlockchain() {
	let state = {
		blockHeight: 1,
		contracts: {
			"seed-variety-registry": {
				data: {
					"next-seed-id": 0,
					"seed-varieties": {},
				},
			},
			"borrower-tracking": {
				data: {
					"next-loan-id": 0,
					"seed-loans": {},
				},
			},
			"growing-success": {
				data: {
					"next-record-id": 0,
					"growing-records": {},
				},
			},
			"seed-verification": {
				data: {
					"next-verification-id": 0,
					"seed-verifications": {},
				},
			},
		},
	}
	
	return {
		blockHeight: state.blockHeight,
		
		reset() {
			state = {
				blockHeight: 1,
				contracts: {
					"seed-variety-registry": {
						data: {
							"next-seed-id": 0,
							"seed-varieties": {},
						},
					},
					"borrower-tracking": {
						data: {
							"next-loan-id": 0,
							"seed-loans": {},
						},
					},
					"growing-success": {
						data: {
							"next-record-id": 0,
							"growing-records": {},
						},
					},
					"seed-verification": {
						data: {
							"next-verification-id": 0,
							"seed-verifications": {},
						},
					},
				},
			}
		},
		
		callPublic(contract, method, args, sender) {
			// This is a simplified mock implementation
			// In a real test environment, this would execute the actual contract logic
			
			if (contract === "seed-variety-registry" && method === "register-seed-variety") {
				const seedId = state.contracts[contract].data["next-seed-id"]
				state.contracts[contract].data["seed-varieties"][seedId] = {
					name: args[0],
					species: args[1],
					family: args[2],
					description: args[3],
					"days-to-maturity": args[4],
					"planting-season": args[5],
					"registered-by": sender,
					"registration-time": state.blockHeight,
				}
				state.contracts[contract].data["next-seed-id"] = seedId + 1
				return { success: true, value: seedId }
			}
			
			if (contract === "borrower-tracking" && method === "checkout-seeds") {
				const loanId = state.contracts[contract].data["next-loan-id"]
				state.contracts[contract].data["seed-loans"][loanId] = {
					"seed-id": args[0],
					borrower: sender,
					"checkout-date": state.blockHeight,
					"expected-return-date": args[3],
					"quantity-borrowed": args[1],
					"quantity-to-return": args[2],
					status: "active",
				}
				state.contracts[contract].data["next-loan-id"] = loanId + 1
				return { success: true, value: loanId }
			}
			
			if (contract === "borrower-tracking" && method === "mark-seeds-returned") {
				const loanId = args[0]
				const loan = state.contracts[contract].data["seed-loans"][loanId]
				
				if (!loan) return { success: false, error: "Loan not found" }
				if (loan.borrower !== sender) return { success: false, error: "Not the borrower" }
				
				state.contracts[contract].data["seed-loans"][loanId].status = "returned"
				return { success: true, value: true }
			}
			
			return { success: false, error: "Method not implemented in mock" }
		},
		
		callReadOnly(contract, method, args) {
			if (contract === "seed-variety-registry" && method === "get-seed-variety") {
				const seedId = args[0]
				return {
					success: true,
					value: state.contracts[contract].data["seed-varieties"][seedId] || null,
				}
			}
			
			if (contract === "seed-variety-registry" && method === "get-next-seed-id") {
				return {
					success: true,
					value: state.contracts[contract].data["next-seed-id"],
				}
			}
			
			if (contract === "borrower-tracking" && method === "get-loan") {
				const loanId = args[0]
				return {
					success: true,
					value: state.contracts[contract].data["seed-loans"][loanId] || null,
				}
			}
			
			return { success: false, error: "Method not implemented in mock" }
		},
	}
}

