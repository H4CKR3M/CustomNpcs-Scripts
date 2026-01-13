interface IVector {
    x: number,
    y: number,
    z: number
}
interface ITagObject {
    [key: string]: any;
}
declare var DRM_KEY: string;
declare var DRM: {
    VERIFICATION_KEY: string,
    VERIFICATION_PATH: string,
    MAP_NAME: string
}
declare var DAILY: {
    REWARD_URL: string,
    MESSAGE_FAILURE: string
}
declare var SERVER: {
    MAP_VERSION: number,
    DAILIES: [any],
    INIT(): void
}
declare var DLC: {
    KEY: string
}
declare var RECIPE_BOOK: {
    ACPVersion: number;
};
/**
 * Legacy Name for HyperMobSpawn
 */
declare var HyperMobSpawner: {
    mobSpawner: {
        summonID: string;
    }
};
/**
 * From Trinket List Catelog: Sea of DIE
 */
declare var SeaOfDie_CO: {
    Login(e: any);
};

declare var config: {}

// declare var Machine: {
//     StateTransition(stateName: string): string | null,
//     NullStateTransition(stateName: string): string | null,
//     states: {
//         Inactive: {
//             name: "Inactive",
//             Enter(): void,
//             Tick(): void,
//             Exit(): void
//         },
//         Disabled: {
//             name: "Disabled",
//             Enter(): void,
//             Tick(): void,
//             Exit(): void
//         },
//     }
// }

declare function ModBaseRate(player: IPlayer, baseRate: number): number;
declare function OnTargetFound(): void;
declare function OnTarget(): void;
declare function OnReset(): void;
declare function OnInit(): void;
declare function OnInteract(): void;
declare function OnAttack(): void;

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// JAVA
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

declare const Java: {
    /**
     * Load a Java class.
     * @param name Full class name (EX: "java.lang.Runnable")
     */
    type<T = any>(name: string): T;

    /**
     * Extend a Java class or implements an interface.
     * @param superclass The Java class or interface to extend.
     * @param methods Implementation methods.
     */
    extend<T = any>(superclass: T, methods: object): T;

    /**
     * Convert a Java array into a JavaScript array.
     */
    from<T = any>(javaArray: T[]): T[];

    /**
     * Convert a JavaScript array into a Java array.
     */
    to<T = any>(jsArray: any[], javaType: T): T;
};

declare const java: {
    io: {
        // File: new (path: string) => any;
        [className: string]: any;
    };
    [pkg: string]: any;
};

declare const javax: {
    swing?: {
        JFrame?: any;
        JButton?: any;
        JLabel?: any;
        ImageIcon?: any;
        [className: string]: any;
    };
    imageio?: {
        ImageIO?: {
            read(file: any): any;
            [method: string]: any;
        };
    };
    [packageName: string]: any;
};

declare const org: {
    apache?: {
        commons?: {
            io?: {
                FileUtils?: {
                    copyURLToFile: (url: any, dest: any) => void;
                    [method: string]: any;
                };
                [className: string]: any;
            };
            [packageName: string]: any;
        };
        [packageName: string]: any;
    };
    [packageName: string]: any;
};

/**
 * The Nashorn 'load' function.
 * Loads and executes a JavaScript file at runtime.
 * @param file The path to the JS file to load.
 */
declare function load(file: string): void;

/**
 * Prints a message in the CustomNpcs console
 * @param message The text to display in the console
 */
declare function print(message: string): void;

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// CustomNpcs API
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

interface IDimension { }

interface IMark { }
interface IEntityItem { }

interface ICustomGui { }
interface IContainer { }
interface IBlock { }
interface ITimers { }
interface IPlayerMail { }

interface IAvailability { }
interface IDialogCategory { }
interface IDialogOption { }

interface IQuestCategory { }
interface IQuestObjective { }

interface IPos {
    add(x: number, y: number, z: number): IPos;
    add(pos: IPos): IPos;
    distanceTo(pos: IPos): number;
    down(): IPos;
    down(n: number): IPos;
    east(): IPos;
    east(n: number): IPos;
    getMCBlockPos(): any; // net.minecraft.util.math.BlockPos
    getX(): number;
    getY(): number;
    getZ(): number;
    normalize(): [number, number, number];
    north(): IPos;
    north(n: number): IPos;
    offset(direction: number): IPos;
    offset(direction: number, n: number): IPos;
    south(): IPos;
    south(n: number): IPos;
    subtract(x: number, y: number, z: number): IPos;
    subtract(pos: IPos): IPos;
    up(): IPos;
    up(n: number): IPos;
    west(): IPos;
    west(n: number): IPos;
}

interface IData {
    clear(): void;
    get(key: string): any;
    getKeys(): string[];
    has(key: string): boolean;
    put(key: string, value: any): void;
    remove(key: string): void;
}

interface INbt {
    clear(): void;

    getBoolean(key: string): boolean;
    getByte(key: string): number;
    getByteArray(key: string): number[];
    getCompound(key: string): INbt | null;
    getDouble(key: string): number;
    getFloat(key: string): number;
    getInteger(key: string): number;
    getIntegerArray(key: string): number[];
    getKeys(): string[];
    getList(key: string, type: number): any[];
    getListType(key: string): number;
    getLong(key: string): number;
    getMCNBT(): any; // net.minecraft.nbt.NBTTagCompound
    getShort(key: string): number;
    getString(key: string): string | null;
    getType(key: string): number;
    has(key: string): boolean;
    isEqual(nbt: INbt): boolean;

    merge(nbt: INbt): void;
    remove(key: string): void;
    setBoolean(key: string, value: boolean): void;
    setByte(key: string, value: number): void;
    setByteArray(key: string, value: number[]): void;
    setCompound(key: string, value: INbt): void;
    setDouble(key: string, value: number): void;
    setFloat(key: string, value: number): void;
    setInteger(key: string, value: number): void;
    setIntegerArray(key: string, value: number[]): void;
    setList(key: string, value: any[]): void;
    setLong(key: string, value: number): void;
    setShort(key: string, value: number): void;
    setString(key: string, value: string | null): void;

    toJsonString(): string;
}

interface IItemStack {
    compare(item: IItemStack, ignoreNBT: boolean): boolean;
    copy(): IItemStack;
    damageItem(damage: number, living: IEntityLiving): void;

    getAttackDamage(): number;
    getAttribute(name: string): number;
    getDisplayName(): string;
    getFoodLevel(): number;
    getItemDamage(): number;
    getItemName(): string;
    getItemNbt(): INbt;
    getLore(): string[];
    getMaxItemDamage(): number;
    getMaxStackSize(): number;
    getMCItemStack(): any; // net.minecraft.item.ItemStack
    getName(): string;
    getNbt(): INbt;
    getStackSize(): number;
    getStoreddata(): IData;
    getTempdata(): IData;
    getType(): number;

    hasAttribute(name: string): boolean;
    hasCustomName(): boolean;
    hasEnchant(id: string): boolean;
    hasNbt(): boolean;

    isBlock(): boolean;
    isBook(): boolean;
    isEmpty(): boolean;
    isEnchanted(): boolean;
    isWearable(): boolean;

    removeEnchant(id: string): boolean;
    removeNbt(): void;

    setAttribute(name: string, value: number, slot?: number): void;
    setCustomName(name: string): void;
    setItemDamage(value: number): void;
    setLore(lore: string[]): void;
    setStackSize(size: number): void;
}

interface IEntityItem {
    getAge(): number;
    getItem(): IItemStack | null;
    getLifeSpawn(): number;
    getOwner(): string | null;
    getPickupDelay(): number;

    setAge(age: number): void;
    setItem(item: IItemStack): void;
    setLifeSpawn(age: number): void;
    setOwner(name: string): void;
    setPickupDelay(delay: number): void;
}

interface IProjectile {
    enableEvents(): void;
    getAccuracy(): number;
    getHasGravity(): boolean;
    getItem(): IItemStack | null;

    setAccuracy(accuracy: number): void;
    setHasGravity(bo: boolean): void;
    setHeading(x: number, y: number, z: number): void;
    setHeading(yaw: number, pitch: number): void;
    setHeading(entity: IEntity): void;
    setItem(item: IItemStack): void;
}

interface IContainer {
    count(item: IItemStack, ignoreDamage: boolean, ignoreNBT: boolean): number;
    getItems(): IItemStack[];
    getMCContainer(): any; // net.minecraft.inventory.Container
    getMCInventory(): any; // net.minecraft.inventory.IInventory
    getSize(): number;
    getSlot(slot: number): IItemStack | null;
    setSlot(slot: number, item: IItemStack | null): void;
}

interface IBlock {
    world: IWorld;
    pos: IPos;
    x: number,
    y: number,
    z: number,

    blockEvent(type: number, data: number): void;
    getContainer(): IContainer | null;
    getDisplayName(): string | null;
    getMCBlock(): any; // net.minecraft.block.Block
    getMCBlockState(): any; // net.minecraft.block.state.IBlockState
    getMCTileEntity(): any; // net.minecraft.tileentity.TileEntity
    getMetadata(): number;
    getName(): string | null;
    getPos(): IPos | null;
    getStoreddata(): IData;
    getTempdata(): IData;
    getTileEntityNBT(): INbt | null;
    getWorld(): IWorld;
    getX(): number;
    getY(): number;
    getZ(): number;
    hasTileEntity(): boolean;
    interact(side: number): void;
    isAir(): boolean;
    isContainer(): boolean;
    isRemoved(): boolean;
    remove(): void;
    setBlock(name: string): IBlock;
    setBlock(block: IBlock): IBlock;
    setMetadata(i: number): void;
    setTileEntityNBT(nbt: INbt): void;
}

interface IRayTrace {
    getBlock(): IBlock | null;
    getPos(): IPos | null;
    getSideHit(): number;
}

interface IScoreboardScore {
    getPlayerName(): string | null;
    getValue(): number;
    setValue(val: number): void;
}

interface IScoreboardObjective {
    createScore(player: string): IScoreboardScore;
    getCriteria(): string | null;
    getDisplayName(): string | null;
    getName(): string | null;
    getScore(player: string): IScoreboardScore | null;
    getScores(): IScoreboardScore[];
    hasScore(player: string): boolean;
    isReadyOnly(): boolean;
    removeScore(player: string): void;
    setDisplayName(name: string | null): void;
}

interface IScoreboardTeam {
    addPlayer(player: string): void;
    clearPlayers(): void;
    getColor(): string | null;
    getDisplayName(): string | null;
    getFriendlyFire(): boolean;
    getName(): string | null;
    getPlayers(): string[];
    getSeeInvisibleTeamPlayers(): boolean;
    hasPlayer(player: string): boolean;
    removePlayer(player: string): void;
    setColor(color: string | null): void;
    setDisplayName(name: string | null): void;
    setFriendlyFire(bo: boolean): void;
    setSeeInvisibleTeamPlayers(bo: boolean): void;
}

interface IScoreboard {
    addObjective(objective: string, criteria: string): IScoreboardObjective;
    addTeam(name: string): IScoreboardTeam;
    deletePlayerScore(player: string, objective: string, datatag: string): void;
    getObjective(name: string): IScoreboardObjective | null;
    getObjectives(): IScoreboardObjective[];
    getPlayerList(): string[];
    getPlayerScore(player: string, objective: string, datatag: string): number;
    getPlayerTeam(player: string): IScoreboardTeam | null;
    getTeam(name: string): IScoreboardTeam | null;
    getTeams(): IScoreboardTeam[];
    hasObjective(objective: string): boolean;
    hasPlayerObjective(player: string, objective: string, datatag: string): boolean;
    hasTeam(name: string): boolean;
    removeObjective(objective: string): void;
    removePlayerTeam(player: string): void;
    removeTeam(name: string): void;
    setPlayerScore(player: string, objective: string, score: number, datatag: string): void;
}

interface IFaction {
    addHostile(id: number): void;
    getAttackedByMobs(): boolean;
    getColor(): number;
    getDefaultPoints(): number;
    getHostileList(): number[];
    getId(): number;
    getIsHidden(): boolean;
    getName(): string | null;
    hasHostile(id: number): boolean;
    hostileToFaction(factionId: number): boolean;
    hostileToNpc(npc: ICustomNpc): boolean;
    playerStatus(player: IPlayer): number;
    removeHostile(id: number): void;
    save(): void;
    setAttackedByMobs(bo: boolean): void;
    setDefaultPoints(points: number): void;
    setIsHidden(bo: boolean): void;
}


interface IQuest {
    getCategory(): IQuestCategory;
    getCompleteText(): string | null;
    getId(): number;
    getIsRepeatable(): boolean;
    getLogText(): string | null;
    getName(): string | null;
    getNextQuest(): IQuest | null;
    getNpcName(): string | null;
    getObjectives(player: IPlayer): IQuestObjective[];
    getRewards(): IContainer;
    getType(): number;

    save(): void;
    setCompleteText(text: string | null): void;
    setLogText(text: string | null): void;
    setName(name: string | null): void;
    setNextQuest(quest: IQuest | null): void;
    setNpcName(name: string | null): void;
    setType(type: number): void;
}


interface IDialog {
    getAvailability(): IAvailability;
    getCategory(): IDialogCategory;
    getCommand(): string | null;
    getId(): number;
    getName(): string | null;
    getOption(slot: number): IDialogOption | null;
    getOptions(): IDialogOption[];
    getQuest(): IQuest | null;
    getText(): string | null;

    save(): void;
    setCommand(command: string | null): void;
    setName(name: string | null): void;
    setQuest(quest: IQuest | null): void;
    setText(text: string | null): void;
}

interface IWorld {
    broadcast(message: string): void;

    createEntity(id: string): IEntity;
    createEntityFromNBT(nbt: INbt): IEntity;
    createItem(name: string, damage: number, size: number): IItemStack;
    createItemFromNbt(nbt: INbt): IItemStack;

    explode(x: number, y: number, z: number, range: number, fire: boolean, grief: boolean): void;

    getAllEntities(type: number): IEntity[];
    getAllPlayers(): IPlayer[];
    getBiomeName(x: number, z: number): string;
    getBlock(x: number, y: number, z: number): IBlock;
    getClone(tab: number, name: string): IEntity;
    getClosestEntity(x: number, y: number, z: number, range: number, type: number): IEntity;
    getClosestEntity(pos: IPos, range: number, type: number): IEntity;
    getDimension(): IDimension;
    getEntity(uuid: string): IEntity;
    getLightValue(x: number, y: number, z: number): number;
    getMCBlockPos(x: number, y: number, z: number): any; // net.minecraft.util.math.BlockPos
    getMCWorld(): any; // net.minecraft.world.WorldServer
    getName(): string;
    getNearbyEntities(x: number, y: number, z: number, range: number, type: number): IEntity[];
    getNearbyEntities(pos: IPos, range: number, type: number): IEntity[];
    getPlayer(name: string): IPlayer | null;
    getRedstonePower(x: number, y: number, z: number): number;
    getScoreboard(): IScoreboard;
    getSpawnPoint(): IBlock;
    getStoreddata(): IData;
    getTempdata(): IData;
    getTime(): number;
    getTotalTime(): number;

    isDay(): boolean;
    isRaining(): boolean;

    playSoundAt(pos: IPos, sound: string, volume: number, pitch: number): void;

    removeBlock(x: number, y: number, z: number): void;
    setBlock(x: number, y: number, z: number, name: string, meta: number): void;

    setRaining(bo: boolean): void;
    setSpawnPoint(block: IBlock): void;
    setTime(time: number): void;

    spawnClone(x: number, y: number, z: number, tab: number, name: string): IEntity;
    spawnEntity(entity: IEntity): void;
    spawnParticle(particle: string, x: number, y: number, z: number, dx: number, dy: number, dz: number, speed: number, count: number): void;
    thunderStrike(x: number, y: number, z: number): void;
}

interface IEntity {
    world: IWorld;
    pos: IPos;
    x: number,
    y: number,
    z: number,

    addRider(entity: IEntity): void;
    addTag(tag: string): void;
    clearRiders(): void;
    damage(amount: number): void;
    despawn(): void;
    dropItem(item: IItemStack): IEntityItem;
    extinguish(): void;
    generateNewUUID(): string;
    getAge(): number;
    getAllRiders(): IEntity[];
    getBlockX(): number;
    getBlockY(): number;
    getBlockZ(): number;
    getEntityName(): string;
    getEntityNbt(): INbt;
    getEyeHeight(): number;
    getHeight(): number;
    getMCEntity<T>(): T;
    getMotionX(): number;
    getMotionY(): number;
    getMotionZ(): number;
    getMount(): IEntity | null;
    getName(): string;
    getNbt(): INbt;
    getPitch(): number;
    getPos(): IPos;
    getRiders(): IEntity[];
    getRotation(): number;
    getStoreddata(): IData;
    getTags(): string[];
    getTempdata(): IData;
    getType(): number;
    getTypeName(): string;
    getUUID(): string;
    getWidth(): number;
    getWorld(): IWorld;
    getX(): number;
    getY(): number;
    getZ(): number;

    hasCustomName(): boolean;
    hasTag(tag: string): boolean;
    inFire(): boolean;
    inLava(): boolean;
    inWater(): boolean;
    isAlive(): boolean;
    isBurning(): boolean;
    isSneaking(): boolean;
    isSprinting(): boolean;

    kill(): void;
    knockback(power: number, direction: number): void;
    playAnimation(type: number): void;
    rayTraceBlock(distance: number, stopOnLiquid: boolean, ignoreBlockWithoutBoundingBox: boolean): IRayTrace;
    rayTraceEntities(distance: number, stopOnLiquid: boolean, ignoreBlockWithoutBoundingBox: boolean): IEntity[];
    removeTag(tag: string): void;
    setBurning(seconds: number): void;
    setEntityNbt(nbt: INbt): void;
    setMotionX(motion: number): void;
    setMotionY(motion: number): void;
    setMotionZ(motion: number): void;
    setMount(entity: IEntity | null): void;
    setName(name: string): void;
    setPitch(pitch: number): void;
    setPos(pos: IPos): void;
    setPosition(x: number, y: number, z: number): void;
    setRotation(rotation: number): void;
    setX(x: number): void;
    setY(y: number): void;
    setZ(z: number): void;
    spawn(): void;
    storeAsClone(tab: number, name: string): void;
    typeOf(type: number): boolean;
}

interface IEntityLivingBase extends IEntity {
    addMark(type: number): IMark;
    addPotionEffect(effect: number, duration: number, strength: number, hideParticles: boolean): void;
    canSeeEntity(entity: IEntity): boolean;
    clearPotionEffects(): void;
    getArmor(slot: number): IItemStack | null;
    getAttackTarget(): IEntityLivingBase | null;
    getHealth(): number;
    getLastAttacked(): IEntityLivingBase | null;
    getLastAttackedTime(): number;
    getMainhandItem(): IItemStack | null;
    getMarks(): IMark[];
    getMaxHealth(): number;
    getMCEntity<T>(): T;
    getMoveForward(): number;
    getMoveStrafing(): number;
    getMoveVertical(): number;
    getOffhandItem(): IItemStack | null;
    getPotionEffect(effect: number): number;

    isAttacking(): boolean;
    isChild(): boolean;
    removeMark(mark: IMark): void;

    setArmor(slot: number, item: IItemStack | null): void;
    setAttackTarget(living: IEntityLivingBase | null): void;
    setHealth(health: number): void;
    setMainhandItem(item: IItemStack | null): void;
    setMaxHealth(health: number): void;
    setMoveForward(move: number): void;
    setMoveStrafing(move: number): void;
    setMoveVertical(move: number): void;
    setOffhandItem(item: IItemStack | null): void;

    swingMainhand(): void;
    swingOffhand(): void;
}

interface IEntityLiving extends IEntityLivingBase {
    clearNavigation(): void;
    getMCEntity<T>(): T;
    getNavigationPath(): IPos | null;
    isNavigating(): boolean;
    jump(): void;
    navigateTo(x: number, y: number, z: number, speed: number): void;
}

interface INPCRole {
    getType(): number;
}

interface INPCJob {
    getType(): number;
}

interface IJobPuppetPart extends INPCJob {
    getRotationX(): number;
    getRotationY(): number;
    getRotationZ(): number;
    setRotation(x: number, y: number, z: number, speed: number): void;
}

interface IJobPuppet extends INPCJob {
    getAnimationSpeed(): number;
    getIsAnimated(): boolean;
    getPart(part: number): IJobPuppetPart;
    setAnimationSpeed(speed: number): void;
    setIsAnimated(bo: boolean): void;
}

interface IJobFollower {
    getFollowing(): string | null;
    getFollowingNpc(): ICustomNpc | null;
    isFollowing(): boolean;
    setFollowing(name: string | null): void;
}

interface INPCInventory {
    getArmor(slot: number): IItemStack | null;
    getDropItem(slot: number): IItemStack | null;
    getExpMax(): number;
    getExpMin(): number;
    getExpRNG(): number;
    getItemsRNG(): IItemStack[];
    getLeftHand(): IItemStack | null;
    getProjectile(): IItemStack | null;
    getRightHand(): IItemStack | null;

    setArmor(slot: number, item: IItemStack | null): void;
    setDropItem(slot: number, item: IItemStack | null, chance: number): void;
    setExp(min: number, max: number): void;
    setLeftHand(item: IItemStack | null): void;
    setProjectile(item: IItemStack | null): void;
    setRightHand(item: IItemStack | null): void;
}


interface INPCAdvanced {
    getLine(type: number, slot: number): string | null;
    getLineCount(type: number): number;
    getSound(type: number): string | null;

    setLine(type: number, slot: number, text: string | null, sound: string | null): void;
    setSound(type: number, sound: string | null): void;
}


interface INPCMelee {
    getDelay(): number;
    getEffectStrength(): number;
    getEffectTime(): number;
    getEffectType(): number;
    getKnockback(): number;
    getRange(): number;
    getStrength(): number;

    setDelay(speed: number): void;
    setEffect(type: number, strength: number, time: number): void;
    setKnockback(knockback: number): void;
    setRange(range: number): void;
    setStrength(strength: number): void;
}

interface INPCRanged {
    getAccelerate(): boolean;
    getAccuracy(): number;
    getBurst(): number;
    getBurstDelay(): number;
    getDelayMax(): number;
    getDelayMin(): number;
    getDelayRNG(): number;
    getEffectStrength(): number;
    getEffectTime(): number;
    getEffectType(): number;
    getExplodeSize(): number;
    getFireType(): number;
    getGlows(): boolean;
    getHasAimAnimation(): boolean;
    getHasGravity(): boolean;
    getKnockback(): number;
    getMeleeRange(): number;
    getParticle(): number;
    getRange(): number;
    getRender3D(): boolean;
    getShotCount(): number;
    getSize(): number;
    getSound(type: number): string | null;
    getSpeed(): number;
    getSpins(): boolean;
    getSticks(): boolean;
    getStrength(): number;

    setAccelerate(accelerate: boolean): void;
    setAccuracy(accuracy: number): void;
    setBurst(count: number): void;
    setBurstDelay(delay: number): void;
    setDelay(min: number, max: number): void;
    setEffect(type: number, strength: number, time: number): void;
    setExplodeSize(size: number): void;
    setFireType(type: number): void;
    setGlows(glows: boolean): void;
    setHasAimAnimation(aim: boolean): void;
    setHasGravity(hasGravity: boolean): void;
    setKnockback(punch: number): void;
    setMeleeRange(range: number): void;
    setParticle(type: number): void;
    setRange(range: number): void;
    setRender3D(render3d: boolean): void;
    setShotCount(count: number): void;
    setSize(size: number): void;
    setSound(type: number, sound: string | null): void;
    setSpeed(speed: number): void;
    setSpins(spins: boolean): void;
    setSticks(sticks: boolean): void;
    setStrength(strength: number): void;
}

interface INPCStats {
    getAggroRange(): number;
    getCombatRegen(): number;
    getCreatureType(): number;
    getHealthRegen(): number;
    getHideDeadBody(): boolean;
    getImmune(type: number): boolean;
    getMaxHealth(): number;
    getMelee(): INPCMelee;
    getRanged(): INPCRanged;
    getResistance(type: number): number;
    getRespawnTime(): number;
    getRespawnType(): number;

    setAggroRange(range: number): void;
    setCombatRegen(regen: number): void;
    setCreatureType(type: number): void;
    setHealthRegen(regen: number): void;
    setHideDeadBody(hide: boolean): void;
    setImmune(type: number, bo: boolean): void;
    setMaxHealth(maxHealth: number): void;
    setResistance(type: number, value: number): void;
    setRespawnTime(seconds: number): void;
    setRespawnType(type: number): void;
}

interface INPCAi {
    getAnimation(): number;
    getAttackInvisible(): boolean;
    getAttackLOS(): boolean;
    getAvoidsWater(): boolean;
    getCanSwim(): boolean;
    getCurrentAnimation(): number;
    getDoorInteract(): number;
    getInteractWithNPCs(): boolean;
    getLeapAtTarget(): boolean;
    getMovingPathPauses(): boolean;
    getMovingPathType(): number;
    getMovingType(): number;
    getNavigationType(): number;
    getRetaliateType(): number;
    getReturnsHome(): boolean;
    getSheltersFrom(): number;
    getStandingType(): number;
    getStopOnInteract(): boolean;
    getTacticalRange(): number;
    getTacticalType(): number;
    getWalkingSpeed(): number;
    getWanderingRange(): number;

    setAnimation(type: number): void;
    setAttackInvisible(attack: boolean): void;
    setAttackLOS(enabled: boolean): void;
    setAvoidsWater(enabled: boolean): void;
    setCanSwim(canSwim: boolean): void;
    setDoorInteract(type: number): void;
    setInteractWithNPCs(interact: boolean): void;
    setLeapAtTarget(leap: boolean): void;
    setMovingPathType(type: number, pauses: boolean): void;
    setMovingType(type: number): void;
    setNavigationType(type: number): void;
    setRetaliateType(type: number): void;
    setReturnsHome(bo: boolean): void;
    setSheltersFrom(type: number): void;
    setStandingType(type: number): void;
    setStopOnInteract(stopOnInteract: boolean): void;
    setTacticalRange(range: number): void;
    setTacticalType(type: number): void;
    setWalkingSpeed(speed: number): void;
    setWanderingRange(range: number): void;
}

interface INPCDisplay {
    getBossbar(): number;
    getBossColor(): number;
    getCapeTexture(): string | null;
    getHasHitbox(): boolean;
    getHasLivingAnimation(): boolean;
    getModel(): string | null;
    getModelScale(part: number): [number, number, number];
    getName(): string;
    getOverlayTexture(): string | null;
    getShowName(): number;
    getSize(): number;
    getSkinPlayer(): string | null;
    getSkinTexture(): string | null;
    getSkinUrl(): string | null;
    getTint(): number;
    getTitle(): string | null;
    getVisible(): number;
    isVisibleTo(player: IPlayer): boolean;

    setBossbar(type: number): void;
    setBossColor(color: number): void;
    setCapeTexture(texture: string | null): void;
    setHasHitbox(bo: boolean): void;
    setHasLivingAnimation(enabled: boolean): void;
    setModel(model: string | null): void;
    setModelScale(part: number, x: number, y: number, z: number): void;
    setName(name: string): void;
    setOverlayTexture(texture: string | null): void;
    setShowName(type: number): void;
    setSize(size: number): void;
    setSkinPlayer(name: string | null): void;
    setSkinTexture(texture: string | null): void;
    setSkinUrl(url: string | null): void;
    setTint(color: number): void;
    setTitle(title: string | null): void;
    setVisible(type: number): void;
}

interface ICustomNpc extends IEntityLiving {
    executeCommand(command: string): string;

    getAdvanced(): INPCAdvanced;
    getAi(): INPCAi;
    getDialog(slot: number): IDialog | null;
    getDisplay(): INPCDisplay;
    getFaction(): IFaction;
    getHomeX(): number;
    getHomeY(): number;
    getHomeZ(): number;
    getInventory(): INPCInventory;
    getJob(): INPCJob;
    getOwner(): IEntityLivingBase | null;
    getRole(): INPCRole;
    getStats(): INPCStats;
    getTimers(): ITimers;

    giveItem(player: IPlayer, item: IItemStack): void;
    reset(): void;
    say(message: string): void;
    sayTo(player: IPlayer, message: string): void;
    setDialog(slot: number, dialog: IDialog): void;
    setFaction(id: number): void;
    setHome(x: number, y: number, z: number): void;

    shootItem(x: number, y: number, z: number, item: IItemStack, accuracy: number): IProjectile;
    shootItem(target: IEntityLivingBase, item: IItemStack, accuracy: number): IProjectile;

    updateClient(): void;
}

interface IPlayer extends IEntityLiving {
    inventory: IContainer;

    addDialog(id: number): void;
    addFactionPoints(faction: number, points: number): void;
    canQuestBeAccepted(id: number): boolean;

    clearData(): void;
    closeGui(): void;

    factionStatus(factionId: number): number;
    finishQuest(id: number): void;

    getActiveQuests(): IQuest[];
    getCustomGui(): ICustomGui | null;
    getDisplayName(): string;
    getExpLevel(): number;
    getFactionPoints(faction: number): number;
    getFinishedQuests(): IQuest[];
    getGamemode(): number;
    getHunger(): number;
    getInventory(): IContainer;
    getInventoryHeldItem(): IItemStack | null;
    getMCEntity<T>(): T;
    getOpenContainer(): IContainer | null;
    getPixelmonData(): any;
    getSpawnPoint(): IBlock | null;
    getTimers(): ITimers;

    giveItem(id: string, damage: number, amount: number): boolean;
    giveItem(item: IItemStack): boolean;

    hasAchievement(achievement: string): boolean;
    hasActiveQuest(id: number): boolean;
    hasFinishedQuest(id: number): boolean;
    hasPermission(permission: string): boolean;
    hasReadDialog(id: number): boolean;

    inventoryItemCount(id: string, damage: number): number;
    inventoryItemCount(item: IItemStack): number;

    kick(message: string): void;
    message(message: string): void;

    playSound(sound: string, volume: number, pitch: number): void;

    removeAllItems(item: IItemStack): void;
    removeDialog(id: number): void;
    removeItem(id: string, damage: number, amount: number): boolean;
    removeItem(item: IItemStack, amount: number): boolean;
    removeQuest(id: number): void;

    resetSpawnpoint(): void;

    sendMail(mail: IPlayerMail): void;
    sendNotification(title: string, msg: string, type: number): void;

    setExpLevel(level: number): void;
    setGamemode(mode: number): void;
    setHunger(level: number): void;
    setSpawnpoint(x: number, y: number, z: number): void;
    setSpawnPoint(block: IBlock): void;
    showChestGui(rows: number): IContainer;
    showCustomGui(gui: ICustomGui): void;
    showDialog(id: number, name: string): void;
    startQuest(id: number): void;
    stopQuest(id: number): void;

    updatePlayerInventory(): void;
}