import { useState } from "react"; // Removed unused `useEffect` to clean up the code
import { Button, Heading, Text, Box, ThumbsRating } from "grommet";
import { AddCircle, SubtractCircle } from "grommet-icons";

import Template from "./BugPageTemplate";
import { expect, useBugTest, useBugTestOnce } from "./tests";

const Bug = () => {
  // Initial state for the component
  const initialState = {
    liked: null, // Whether the bug is liked or disliked
    likedBy: ["Bugcatcher Laura", "Grubeater Kelly"], // List of users who liked the bug
    level: null, // Purchase level
  };

  return (
    <Template bug={bug}>
      {/* Pass initial state to the PilferingPillbug component */}
      <PilferingPillbug {...initialState} />
    </Template>
  );
};

/**
 * Fix issues to catch bug:
 *
 * - Inverse data flow
 * - Introducing local state
 */
const PilferingPillbug = (props) => {
  // Local state for purchase level, like status, and list of users who liked the bug
  const [purchaseLevel, setPurchaseLevel] = useState(props.level);
  const [likeStatus, setLikeStatus] = useState(
    props.liked === null ? null : props.liked ? "like" : "dislike"
  );
  const [currentlyLikedBy, setCurrentlyLikedBy] = useState(props.likedBy);

  // Handler for updating the purchase level
  const handleOnLevelChange = (level) => {
    setPurchaseLevel(level);
  };

  // Handler for updating the like status and adding/removing "Buglearner Anonymous"
  const handleOnLikeChange = (likeState) => {
    setLikeStatus(likeState);

    if (currentlyLikedBy.indexOf("Buglearner Anonymous") < 0) {
      // Add "Buglearner Anonymous" to the list if not already present
      setCurrentlyLikedBy(["Buglearner Anonymous", ...currentlyLikedBy]);
    } else {
      // Remove "Buglearner Anonymous" from the list if already present
      setCurrentlyLikedBy(
        currentlyLikedBy.filter((by) => by !== "Buglearner Anonymous")
      );
    }
  };

  // Test to ensure the purchase summary displays correctly
  useBugTest("should display a purchase summary", ({ findByTestId }) => {
    expect(findByTestId("summary").innerText).to.contain(
      findByTestId("level").innerText.toLowerCase()
    );
    if (findByTestId("liked").dataset.liked === "like") {
      expect(findByTestId("summary").innerText).to.match(/you like$/);
    } else if (findByTestId("liked").dataset.liked === "dislike") {
      expect(findByTestId("summary").innerText).to.match(/you dislike$/);
    } else {
      throw Error("Neither like nor dislike");
    }
  });

  // Test to ensure the purchase summary heading is styled correctly
  useBugTest(
    "should display a level 3 heading for purchase summary",
    ({ findByTestId }) => {
      expect(
        window.getComputedStyle(findByTestId("purchaseSummaryHeading")).fontSize
      ).to.equal("26px");
    }
  );

  return (
    <>
      <Heading level={3}>{bug.name}</Heading>
      {/* LikeButton component to handle liking/disliking */}
      <LikeButton
        liked={likeStatus}
        likedBy={currentlyLikedBy}
        onLikeChange={handleOnLikeChange}
        {...props}
      />
      {/* BugAttributes component to handle purchase level selection */}
      <BugAttributes
        onLevelChange={handleOnLevelChange}
        level={purchaseLevel}
      />
      {/* Display purchase summary if a level is selected */}
      {purchaseLevel ? (
        <PurchaseSummary level={purchaseLevel} liked={likeStatus} />
      ) : null}
    </>
  );
};

const LikeButton = ({ liked, likedBy, onLikeChange }) => {
  const [hasLiked, setHasLiked] = useState(false);

  // Handler for like/dislike change
  const handleOnChange = (event) => {
    const isLiked = event.target.value === "like";
    if (isLiked) {
      setHasLiked(true);
    }
    onLikeChange(event.target.value);
  };

  // Test to ensure "Buglearner Anonymous" is in the likedBy list
  useBugTest("should be liked by Buglearner Anonymous", ({ findByTestId }) => {
    expect(findByTestId("liked-by: Buglearner Anonymous")).to.exist;
  });

  // Test to ensure "Buglearner Anonymous" is removed when disliked
  useBugTestOnce(
    "should remove Buglearner Anonymous when disliked",
    ({ findByTestId }) => {
      expect(hasLiked).to.be.true;
      expect(liked).to.equal("dislike");
      expect(findByTestId("liked-by: Buglearner Anonymous")).not.to.exist;
    }
  );

  return (
    <Box direction="row">
      {/* ThumbsRating component for liking/disliking */}
      <ThumbsRating
        name="liked"
        data-test="liked"
        data-liked={liked}
        value={liked}
        onChange={handleOnChange}
      />
      <Text margin={{ left: "xsmall" }}>Liked by</Text>
      {/* Display list of users who liked the bug */}
      {likedBy.map((customer, i) => (
        <Text
          color="text-weak"
          key={customer}
          data-test={`liked-by: ${customer}`}
          margin={{ left: "xsmall" }}
        >
          {customer}
          {i !== likedBy.length - 1 ? ", " : null}
        </Text>
      ))}
    </Box>
  );
};

function BugAttributes({ level, onLevelChange }) {
  // Handlers for increasing/decreasing the purchase level
  const onLevelUp = () => {
    onLevelChange(level + 1);
  };
  const onLevelDown = () => {
    onLevelChange(level - 1);
  };

  return (
    <Box>
      <Heading level={3}>choose level</Heading>
      <Box
        direction="row"
        gap="small"
        align="center"
        margin={{ bottom: "medium" }}
      >
        {/* Button to decrease level */}
        <Button
          onClick={onLevelDown}
          disabled={level <= 1}
          icon={<SubtractCircle />}
        />
        {/* Display current level */}
        <Text color="text-weak" data-test="level">
          Level {level}
        </Text>
        {/* Button to increase level */}
        <Button
          primary
          onClick={onLevelUp}
          disabled={level >= 100}
          icon={<AddCircle />}
        />
      </Box>
    </Box>
  );
}

function PurchaseSummary({ level, liked }) {
  return (
    <>
      {/* Heading for the purchase summary */}
      <Heading
        data-test="purchaseSummaryHeading"
        level={3}
        margin={{ top: "medium" }}
      >
        summary
      </Heading>

      {/* Display purchase summary text */}
      <Text data-test="summary" color="text-weak">
        You are purchasing a level {level} {bug.name} that you{" "}
        {liked === "like"
          ? "like"
          : liked === "dislike"
          ? "dislike"
          : "haven't decided if you like or not"}
      </Text>
    </>
  );
}

export const bug = {
  title: "Passing Props",
  subtitle:
    "this pilfering pillbug can cause confusion and chaos when trying to modify props or state",
  name: "Pilfering Pillbug",
  price: "$7.99",
  route: "/bug/pilfering-pillbug",
  component: Bug,
};

export default Bug;