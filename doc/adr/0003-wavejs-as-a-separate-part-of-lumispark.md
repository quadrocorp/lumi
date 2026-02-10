# 3. WaveJS as a separate part of LumiSpark

Date: 2026-02-10

## Status

Accepted

## Context

The planned solution for testing UI via the generation of mock data and information requires additional creation of a module, which will generate the arrays of natural looking data to test charts, stat filtering and to adjust the look and feel of the UI.

The idea behind WaveJS is the generation of data using waveforms as a reference. WaveJS will be in a seperate repository and available under MIT license.

## Decision

Separate LumiSpark - a test mock-data generator for Lumi's UI testing and debugging.

The Spark module is now interanl only, no separate repo due to how specific in use it is only to Lumi's ecosystem.

While WaveJS is going to be separate into a separate module.

## Consequences

What becomes easier or more difficult to do and any risks introduced by the change that will need to be mitigated.
