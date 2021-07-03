import React from 'react';
import { screen, render } from '@testing-library/react';
import { Button } from './index';
import './style.scss';

describe("Button is component", () => {

  render(<Button />);

  describe("when component is rendered", () => {

    it("button is contain", () => {
      const button = screen.getAllByRole("button");
      expect(button.length).toBe(1);
    })
  })
})