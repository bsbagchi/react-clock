// Simple function to calculate angles based on the time
export function getClockAngles(hours: i32, minutes: i32, seconds: i32): f32[] {
  const hourAngle = (hours % 12) * 30 + (minutes / 60) * 30;
  const minuteAngle = (minutes / 60) * 360;
  const secondAngle = (seconds / 60) * 360;
  return [hourAngle, minuteAngle, secondAngle];
}
