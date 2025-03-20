import { describe, it, expect, beforeEach } from "vitest"
import { mockBlockchain, mockPrincipal } from "./test-utils"

// Mock blockchain for testing
const blockchain = mockBlockchain()
const alice = mockPrincipal("ST1SJ3DTE5DN7X54YDH5D64R3BCB6A2AG2ZQ8YPD5")
const bob = mockPrincipal("ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG")

describe("Seed Variety Registry", () => {
  beforeEach(() => {
    blockchain.reset()
  })
  
  it("should register a new seed variety", () => {
    const result = blockchain.callPublic(
        "seed-variety-registry",
        "register-seed-variety",
        [
          "Brandywine Tomato",
          "Solanum lycopersicum",
          "Solanaceae",
          "Heirloom tomato variety with large, pink fruits and excellent flavor.",
          85,
          "Spring",
        ],
        alice,
    )
    
    expect(result.success).toBe(true)
    expect(result.value).toBe(0)
    
    const seedInfo = blockchain.callReadOnly("seed-variety-registry", "get-seed-variety", [0])
    expect(seedInfo.success).toBe(true)
    expect(seedInfo.value.name).toBe("Brandywine Tomato")
    expect(seedInfo.value["registered-by"]).toBe(alice)
  })
  
  it("should increment seed ID for each new registration", () => {
    blockchain.callPublic(
        "seed-variety-registry",
        "register-seed-variety",
        [
          "Brandywine Tomato",
          "Solanum lycopersicum",
          "Solanaceae",
          "Heirloom tomato variety with large, pink fruits and excellent flavor.",
          85,
          "Spring",
        ],
        alice,
    )
    
    blockchain.callPublic(
        "seed-variety-registry",
        "register-seed-variety",
        [
          "Black Beauty Zucchini",
          "Cucurbita pepo",
          "Cucurbitaceae",
          "Productive dark green zucchini variety.",
          50,
          "Summer",
        ],
        bob,
    )
    
    const nextId = blockchain.callReadOnly("seed-variety-registry", "get-next-seed-id", [])
    expect(nextId.success).toBe(true)
    expect(nextId.value).toBe(2)
  })
})

