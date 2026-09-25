export interface StudentInfo {
  name: string;
  prn: string;
  semester: string;
  section: string;
  subject: string;
  institution: string;
}

export interface ResearchMetadata {
  project_title: string;
  student: StudentInfo;
  timestamp: string;
  status: string;
}

export interface DatasetInfo {
  name: string;
  source: string;
  dataset_number: number;
  observations: number;
  batteries_count: number;
  batteries: string[];
  features_count: number;
  raw_files_count: number;
}

export interface ModelMetric {
  name: string;
  mae: number;
  rmse: number;
  r2: number;
}

export interface ImprovementMetrics {
  mae_percent: number;
  rmse_percent: number;
}

export interface BatterywiseResults {
  unseen_batteries: string[];
  models: ModelMetric[];
  selected_model: ModelMetric;
}

export interface DegradationMetrics {
  mean_slope: number;
  median_slope: number;
  unit: string;
}

export interface FeatureImportance {
  feature: string;
  importance: number;
}

export interface ShapFeature {
  feature: string;
  mean_abs_shap: number;
}

export interface FeatureScreeningMetric {
  feature: string;
  pearson_abs: number;
  f_score: number;
  mutual_info: number;
  composite_score: number;
}

export interface OutlierMetric {
  feature: string;
  outlier_count: number;
  lower_bound: number;
  upper_bound: number;
}

export interface CyclePoint {
  cycle_index: number;
  soh: number;
  capacity_ah: number;
  duration_s: number;
  temp_mean: number | null;
}

export interface BatteryTrajectory {
  battery_id: string;
  profile_group: string;
  cycles_count: number;
  initial_capacity_ah: number;
  final_soh: number;
  slope: number | null;
  cycles: CyclePoint[];
}

export interface MeanTrajectoryPoint {
  cycle_index: number;
  mean_soh: number;
  min_soh: number;
  max_soh: number;
  battery_count: number;
}

export interface ActualVsPredictedPoint {
  battery_id: string;
  cycle_index: number;
  actual_soh: number;
  predicted_soh: number;
  error: number;
  abs_error: number;
}

export interface ExperimentResults {
  metadata: ResearchMetadata;
  dataset: DatasetInfo;
  models: ModelMetric[];
  selected_model: ModelMetric;
  baseline: ModelMetric;
  improvement: ImprovementMetrics;
  batterywise: BatterywiseResults;
  degradation: DegradationMetrics;
  top_features: FeatureImportance[];
  shap_features: ShapFeature[];
  feature_screening: FeatureScreeningMetric[];
  outliers: OutlierMetric[];
  trajectories: BatteryTrajectory[];
  mean_trajectory: MeanTrajectoryPoint[];
  actual_vs_predicted: ActualVsPredictedPoint[];
}
