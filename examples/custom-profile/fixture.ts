import { testWithChainwright } from "chainwright/core";
import { metamaskFixture } from "chainwright/metamask";

export const testWithTeamProfile = testWithChainwright(
    metamaskFixture({
        profileName: "team-profile",
    }),
);

// Your Fixture here!
export const customFixture = testWithTeamProfile.extend({
    // fixture properties
});
