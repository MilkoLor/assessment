
import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import App from "./App";
import axios from "axios";

jest.mock("axios");

describe("App integration", () => {

  it("renders loading, then summary and anomalies", async () => {
    axios.get.mockImplementation(url => {
      if (url.includes("anomalies")) {
        return Promise.resolve({ data: [
          { userId: 1, id: 1, title: "short", reason: ["Title shorter than 15 characters"] },
          { userId: 2, id: 2, title: "spam title", reason: ["User has >5 similar titles (possible bot)"] }
        ] });
      }
      if (url.includes("summary")) {
        return Promise.resolve({ data: {
          top_users: [
            { userId: 1, unique_word_count: 5, unique_words: ["a", "b", "c", "d", "e"] },
            { userId: 2, unique_word_count: 2, unique_words: ["spam", "title"] }
          ],
          common_words: ["a", "b", "c"]
        }});
      }
      return Promise.reject();
    });

    render(<App />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
    await waitFor(() => expect(screen.getByText(/summary/i)).toBeInTheDocument());
    expect(screen.getAllByText(/anomalies/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/short/).length).toBeGreaterThan(0);
    expect(screen.getByText(/Title shorter than 15 characters/)).toBeInTheDocument();
    // Test for similar titles anomaly
    expect(screen.getAllByText(/spam title/).length).toBeGreaterThan(0);
    expect(screen.getByText(/possible bot/i)).toBeInTheDocument();
  });

  it("shows error on fetch failure", async () => {
    axios.get.mockRejectedValue(new Error("fail"));
    render(<App />);
    await waitFor(() => expect(screen.getByText(/failed to fetch/i)).toBeInTheDocument());
  });
});
