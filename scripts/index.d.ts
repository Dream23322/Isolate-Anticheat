import { Player, Entity, EntityComponent, Container, ItemComponent, EnchantmentList, Vector3 } from "@minecraft/server";

declare module "@minecraft/server" {
	interface Player {
		Player

		// Booleans
		isGlobalBanned: boolean
		flagAutotoolA: boolean
		flagNamespoofA: boolean
		flagNamespoofB: boolean

		// Numbers
		pitch: number
		blocksBroken: number	
		startBreakTime: number
		lastSelectedSlot: number
		autotoolSwitchDelay: number
		cps: number
		firstAttack: number
		lastThrow: number
		lastMessageSent: number

		// Arrays
		entitiesHit: Array<String>
		reports: Array<String>
	
		// Rotation Data
		lastRotation: {x: number, y: number}
		deltaPitch: number
		deltaYaw: number
		pitchAccel: number
		yawAccel: number
		
		// Objects
		lastGoodPosition: Vector3
	}

	interface Entity {
		Entity,
		
		// Booleans
		flagAutotoolA: boolean

		// Strings
		name: string

		// Numbers
		cps: number,
		selectedSlot: number
		lastThrow: number
		startBreakTime: number
		lastSelectedSlot: number
		autotoolSwitchDelay: number
		lastMessageSent: number

		// Arrays
		entitiesHit: Array<String>
	}
}