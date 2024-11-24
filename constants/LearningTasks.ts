const LearningTasks =  {
    items: [
        {
            key: 'task_balancing',
            tasks: [
                "BALANCING.ROPE_BALANCING",
                "BALANCING.BENCH_BALANCING",
                "BALANCING.WOBBLY_BENCH",
                "BALANCING.MOUNTAIN_CLIMBING",
                "BALANCING.OPPOSING_TRAFFIC",
                "BALANCING.SEESAW",
                "BALANCING.ROPE_DANCER",
                "BALANCING.BALANCING_ON_BALLS",
                "BALANCING.CIRCUS_ARTISTS",
                "BALANCING.BALANCING_ON_MATS",
                "BALANCING.DONT_WOBBLE",
                "BALANCING.UNSTABLE_DEVICES",

            ]
        },
        {
            key: 'task_rolling',
            tasks: [
                "ROLLING.INCLINED_PLANE",
                "ROLLING.FORWARD_ROLL",
                "ROLLING.PENDULUM",
                "ROLLING.JUDO_ROLLS",
                "ROLLING.MAT_ROLLS",
                "ROLLING.ROLL_OFF_THE_BOX",
                "ROLLING.VARIABLE_ROLLING",
                "ROLLING.ROLLING_PRECISELY",
                "ROLLING.ROLL_UP",
                "ROLLING.DIVE_ROLL",
                "ROLLING.PARTNER_ROLLS",
            ]
        },
        {
            key: 'task_jumping',
            tasks: [
                "JUMPING.JUMPING_1",
                "JUMPING.JUMPING_2",
                "JUMPING.ROPE_JUMPING_1",
                "JUMPING.ROPE_JUMPING_2",
                "JUMPING.ROPE_JUMPING_3",
                "JUMPING.ROPE_JUMPING_4",
                "JUMPING.MAT_HIGHWAY",
                "JUMPING.GROUND_ROPE_JUMPING_1",
                "JUMPING.GROUND_ROPE_JUMPING_2",
                "JUMPING.ROPE_ROLLER",
                "JUMPING.MASTER_OF_RHYTHM",
                "JUMPING.SWINGING_KING_QUEEN",
                "JUMPING.JUMP_IN_AND_OUT",
                "JUMPING.JUMPING_COURSE",
            ]
        },
        {
            key: 'task_running',
            tasks: [
                "RUNNING.RUNNING_1",
                "RUNNING.RUNNING_2",
                "RUNNING.RUNNING_3",
                "RUNNING.RUNNING_4",
                "RUNNING.GIANT_SLALOM",
                "RUNNING.SIDE_STEP",
                "RUNNING.RUNNING_COURSE",
                "RUNNING.HEY_SHARK",
                "RUNNING.STAR_RUN",
                "RUNNING.VARIABLE_RUNNING"
            ]
        },
        {
            key: 'task_bouncing',
            tasks: [
                "BOUNCING.PUDDLES_BOUNCING",
                "BOUNCING.BOUNCING_STATIONS",
                "BOUNCING.BOUNCING_OVER_CONES",
                "BOUNCING.SEAT_BOUNCING",
                "BOUNCING.NUMBERBALL_BOUNCING",
                "BOUNCING.SURROUNDING_HOOPS_WHILE_BOUNCING",
                "BOUNCING.SHADOW_BOUNCING",
                "BOUNCING.BENCH_BOUNCING",
                "BOUNCING.CIRCLE_BOUNCING",
                "BOUNCING.BOUNCING_IN_DIFFERENT_POSITIONS",
            ]
        },
        {
            key: 'task_catching',
            tasks: [
                "CATCHING.CATCHING_STATIONS",
                "CATCHING.KEEP_THE_WATER_CLEAN",
                "CATCHING.TARGET_HOOPS",
                "CATCHING.TIGERBALL",
                "CATCHING.BOXING",
                "CATCHING.LOOKING_AT_THE_BALL",
                "CATCHING.REACTING",
                "CATCHING.WALL_BALL",
                "CATCHING.TRAJECTORY",
                "CATCHING.FLYING_BALL",
                "CATCHING.FISHERMAN"
            ]
        },
        {
            key: 'task_throwing',
            tasks: [
                "THROWING.THROWING_MASTER",
                "THROWING.THROWING_STATIONS",
                "THROWING.KEEP_YOUR_GARDEN_CLEAN",
                "THROWING.SCORE_MASTER",
                "THROWING.FALLING_OVER",
                "THROWING.HIT_THE_TARGET",
                "THROWING.THROWING_OFF",
                "THROWING.DICE",
                "THROWING.ENCHANT_AND_REDEEM",
                "THROWING.THROWING_HOOPS",
                "THROWING.TARGET_HOOPS",
                "THROWING.TIGER_BALL",
                "THROWING.BOXING",
                "THROWING.LOOKING_AT_THE_BALL",
                "THROWING.WILD_PIG",
                "THROWING.DISTANCE_THROWING",
            ]
        },
        {
            key: 'task_dribbling',
            tasks: [
                "DRIBBLING.STOPP_BALL",
                "DRIBBLING.LINE_DRIBBLING",
                "DRIBBLING.WALL_OFF",
                "DRIBBLING.LIFT_BALL",
                "DRIBBLING.DRIBBLING_1",
                "DRIBBLING.DRIBBLING_2",
                "DRIBBLING.IN_THE_LAND_OF_SHELLS_1",
                "DRIBBLING.IN_THE_LAND_OF_SHELLS_2",
                "DRIBBLING.PROTECT_YOUNG_FISH",
                "DRIBBLING.WITHIN_SHARK_TERRITORY",
                "DRIBBLING.DRIBBLING_VARIATIONS",
                "DRIBBLING.DRIBBLING_NUMBER_BALL",
                "DRIBBLING.PROTECTING_PERSON_DRIBBLING",
            ]
        }
    ]
}

export const getTaskGroupByTask = (task: string) => {
    return LearningTasks.items.find(t => t.tasks.includes(task))?.key
}

export default LearningTasks;